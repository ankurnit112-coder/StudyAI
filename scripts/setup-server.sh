#!/bin/bash

# StudyAI Production Server Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root for initial server setup"
fi

# Update system
log "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install essential packages
log "Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    htop \
    vim \
    ufw \
    fail2ban \
    unattended-upgrades \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
log "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose (standalone)
log "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create studyai user
log "Creating studyai user..."
useradd -m -s /bin/bash studyai
usermod -aG docker studyai

# Setup SSH key for studyai user (you'll need to add your public key)
log "Setting up SSH for studyai user..."
mkdir -p /home/studyai/.ssh
chmod 700 /home/studyai/.ssh
# You need to add your public key here:
# echo "your-ssh-public-key-here" > /home/studyai/.ssh/authorized_keys
chmod 600 /home/studyai/.ssh/authorized_keys
chown -R studyai:studyai /home/studyai/.ssh

# Configure firewall
log "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp  # Frontend (temporary, will be behind reverse proxy)
ufw allow 8000/tcp  # Backend API (temporary, will be behind reverse proxy)
ufw --force enable

# Configure fail2ban
log "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Configure automatic security updates
log "Configuring automatic security updates..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

# Create application directories
log "Creating application directories..."
mkdir -p /opt/studyai
mkdir -p /opt/studyai-backups
mkdir -p /var/log/studyai

# Set permissions
chown -R studyai:studyai /opt/studyai
chown -R studyai:studyai /opt/studyai-backups
chown -R studyai:studyai /var/log/studyai

# Clone repository (you'll need to update this with your actual repo)
log "Cloning StudyAI repository..."
cd /opt/studyai
# Replace with your actual repository URL
# git clone https://github.com/yourusername/studyai.git .
# chown -R studyai:studyai /opt/studyai

# Install Node.js (for any frontend build requirements)
log "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Python (for any backend requirements)
log "Installing Python..."
apt-get install -y python3 python3-pip python3-venv

# Setup log rotation
log "Setting up log rotation..."
cat > /etc/logrotate.d/studyai << EOF
/var/log/studyai/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 studyai studyai
    postrotate
        docker-compose -f /opt/studyai/docker-compose.prod.yml restart backend frontend
    endscript
}
EOF

# Setup monitoring
log "Setting up basic monitoring..."
cat > /etc/cron.d/studyai-monitoring << EOF
# Check StudyAI services every 5 minutes
*/5 * * * * studyai /opt/studyai/scripts/health-check.sh
# Daily backup at 2 AM
0 2 * * * studyai /opt/studyai/scripts/backup.sh
EOF

# Create health check script
cat > /opt/studyai/scripts/health-check.sh << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/studyai/health-check.log"

check_service() {
    if curl -f -s $1 > /dev/null; then
        echo "$(date): $2 is healthy" >> $LOG_FILE
    else
        echo "$(date): $2 is DOWN!" >> $LOG_FILE
        # Send alert (you can integrate with your alerting system)
    fi
}

check_service "http://localhost:3000/api/health" "Frontend"
check_service "http://localhost:8000/health" "Backend"
EOF

chmod +x /opt/studyai/scripts/health-check.sh
chown studyai:studyai /opt/studyai/scripts/health-check.sh

# Setup SSL certificate renewal (if using Let's Encrypt)
log "Setting up SSL certificate renewal..."
cat > /etc/cron.d/certbot-renew << EOF
# Renew SSL certificates twice daily
0 */12 * * * root certbot renew --quiet --deploy-hook "docker-compose -f /opt/studyai/docker-compose.prod.yml restart traefik"
EOF

# Configure system limits
log "Configuring system limits..."
cat >> /etc/security/limits.conf << EOF
studyai soft nofile 65536
studyai hard nofile 65536
studyai soft nproc 32768
studyai hard nproc 32768
EOF

# Configure kernel parameters
cat >> /etc/sysctl.conf << EOF
# StudyAI optimizations
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
vm.max_map_count = 262144
EOF

sysctl -p

# Start and enable Docker
log "Starting Docker service..."
systemctl enable docker
systemctl start docker

# Final instructions
log "Server setup completed!"
log "Next steps:"
log "1. Add your SSH public key to /home/studyai/.ssh/authorized_keys"
log "2. Clone your StudyAI repository to /opt/studyai"
log "3. Configure environment variables in /opt/studyai/.env.prod"
log "4. Run the deployment script as studyai user"
log "5. Configure your domain DNS to point to this server"

warn "Remember to:"
warn "- Change default passwords"
warn "- Configure backup storage"
warn "- Set up monitoring alerts"
warn "- Test the deployment process"

log "You can now switch to the studyai user: sudo su - studyai"