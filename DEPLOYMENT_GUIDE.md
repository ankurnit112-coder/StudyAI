# 🚀 StudyAI Production Deployment Guide

## 📋 **Prerequisites**

### **Server Requirements:**
- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 4+ cores (8+ recommended)
- **RAM**: 8GB minimum (16GB+ recommended)
- **Storage**: 100GB+ SSD
- **Network**: Static IP with domain name

### **Software Requirements:**
- Docker 20.10+
- Docker Compose 2.0+
- Git
- SSL Certificate (Let's Encrypt recommended)

---

## 🔧 **Initial Server Setup**

### **1. Run Server Setup Script:**
```bash
# Download and run the server setup script
wget https://raw.githubusercontent.com/yourusername/studyai/main/scripts/setup-server.sh
chmod +x setup-server.sh
sudo ./setup-server.sh
```

### **2. Configure SSH Access:**
```bash
# Add your SSH public key
sudo nano /home/studyai/.ssh/authorized_keys
# Paste your public key and save

# Test SSH access
ssh studyai@your-server-ip
```

### **3. Clone Repository:**
```bash
# Switch to studyai user
sudo su - studyai

# Clone the repository
cd /opt/studyai
git clone https://github.com/yourusername/studyai.git .
```

---

## 🔐 **Environment Configuration**

### **1. Create Production Environment File:**
```bash
# Copy and edit the production environment file
cp .env.production .env.prod
nano .env.prod
```

### **2. Required Environment Variables:**
```bash
# Database
DB_PASSWORD=your-secure-database-password-here

# Redis
REDIS_PASSWORD=your-secure-redis-password-here

# API Security
SECRET_KEY=your-super-secure-secret-key-min-32-chars

# SSL/Domain
ACME_EMAIL=admin@yourdomain.com

# Monitoring
GRAFANA_PASSWORD=your-secure-grafana-password
```

### **3. GitHub Secrets (for CI/CD):**
Set these in your GitHub repository settings:
- `PROD_HOST`: Your server IP/domain
- `PROD_USER`: studyai
- `PROD_SSH_KEY`: Private SSH key for deployment
- `DB_PASSWORD`: Database password
- `SECRET_KEY`: API secret key
- `REDIS_PASSWORD`: Redis password
- `ACME_EMAIL`: Email for SSL certificates
- `GRAFANA_PASSWORD`: Grafana admin password
- `SLACK_WEBHOOK`: (Optional) Slack webhook for notifications

---

## 🚀 **Deployment Methods**

### **Method 1: Automated CI/CD (Recommended)**

1. **Push to main branch** - Deployment happens automatically
2. **Monitor GitHub Actions** for deployment status
3. **Check health endpoints** after deployment

### **Method 2: Manual Deployment**

```bash
# Switch to studyai user
sudo su - studyai
cd /opt/studyai

# Run deployment script
./scripts/deploy.sh deploy
```

### **Method 3: Docker Compose**

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔍 **Health Checks & Monitoring**

### **Health Check Endpoints:**
- **Frontend**: `https://yourdomain.com/api/health`
- **Backend**: `https://api.yourdomain.com/health`
- **Database**: Checked internally
- **Redis**: Checked internally

### **Monitoring Dashboards:**
- **Grafana**: `https://yourdomain.com:3001` (admin/your-grafana-password)
- **Prometheus**: `https://yourdomain.com:9090`
- **Traefik**: `https://traefik.yourdomain.com:8080`

### **Manual Health Check:**
```bash
# Check all services
./scripts/deploy.sh health

# Check individual services
curl -f https://yourdomain.com/api/health
curl -f https://api.yourdomain.com/health
```

---

## 🔄 **Backup & Recovery**

### **Automated Backups:**
- **Database**: Daily at 2 AM
- **ML Models**: Daily at 2 AM
- **Configuration**: Daily at 2 AM
- **Retention**: 30 days

### **Manual Backup:**
```bash
# Create backup
./scripts/backup.sh

# List backups
ls -la /opt/studyai-backups/
```

### **Recovery:**
```bash
# Rollback to previous version
./scripts/deploy.sh rollback

# Restore from specific backup
./scripts/restore.sh backup_20240119_020000
```

---

## 🔧 **Maintenance Tasks**

### **Daily:**
- Monitor health check logs
- Check system resources
- Review application logs

### **Weekly:**
- Update system packages
- Review backup integrity
- Check SSL certificate status

### **Monthly:**
- Security audit
- Performance optimization
- Capacity planning review

---

## 📊 **Performance Optimization**

### **Frontend Optimization:**
- CDN configuration
- Image optimization
- Caching strategies
- Bundle size monitoring

### **Backend Optimization:**
- Database query optimization
- ML model caching
- API response caching
- Connection pooling

### **Infrastructure Optimization:**
- Load balancing
- Auto-scaling
- Resource monitoring
- Cost optimization

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Services Won't Start:**
```bash
# Check Docker status
sudo systemctl status docker

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### **2. SSL Certificate Issues:**
```bash
# Check certificate status
docker-compose -f docker-compose.prod.yml exec traefik cat /letsencrypt/acme.json

# Force certificate renewal
docker-compose -f docker-compose.prod.yml exec traefik certbot renew --force-renewal
```

#### **3. Database Connection Issues:**
```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

#### **4. ML Model Issues:**
```bash
# Check model files
docker-compose -f docker-compose.prod.yml exec backend ls -la /app/models/

# Retrain models
docker-compose -f docker-compose.prod.yml exec backend python simple_train.py
```

---

## 📞 **Support & Monitoring**

### **Log Locations:**
- **Application Logs**: `/var/log/studyai/`
- **Docker Logs**: `docker-compose logs`
- **System Logs**: `/var/log/syslog`

### **Monitoring Alerts:**
- High CPU/Memory usage
- Service downtime
- SSL certificate expiration
- Database connection issues
- ML model prediction errors

### **Emergency Contacts:**
- **System Admin**: admin@yourdomain.com
- **DevOps Team**: devops@yourdomain.com
- **On-call**: +1-xxx-xxx-xxxx

---

## 🔄 **Scaling Guidelines**

### **Horizontal Scaling:**
```bash
# Scale frontend
docker-compose -f docker-compose.prod.yml up -d --scale frontend=3

# Scale backend
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

### **Vertical Scaling:**
- Increase server resources
- Update Docker resource limits
- Optimize application configuration

### **Database Scaling:**
- Read replicas
- Connection pooling
- Query optimization
- Partitioning strategies

---

## ✅ **Post-Deployment Checklist**

- [ ] All services are running
- [ ] Health checks are passing
- [ ] SSL certificates are valid
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] DNS is properly configured
- [ ] Firewall rules are set
- [ ] Performance is acceptable
- [ ] Security scan completed
- [ ] Documentation updated

---

## 📚 **Additional Resources**

- **Docker Documentation**: https://docs.docker.com/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Traefik Documentation**: https://doc.traefik.io/traefik/
- **Prometheus Documentation**: https://prometheus.io/docs/

---

*Deployment Guide Version: 2.0*  
*Last Updated: 2025-01-19*  
*Status: Production Ready 🚀*