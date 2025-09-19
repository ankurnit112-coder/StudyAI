#!/bin/bash

# StudyAI Production Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/opt/studyai"
BACKUP_DIR="/opt/studyai-backups"
LOG_FILE="/var/log/studyai-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
    
    log "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"
    
    mkdir -p $BACKUP_PATH
    
    # Backup database
    docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml exec -T postgres pg_dump -U studyai studyai_prod > $BACKUP_PATH/database.sql
    
    # Backup ML models
    docker cp $(docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml ps -q backend):/app/models $BACKUP_PATH/
    
    # Backup configuration
    cp $DEPLOY_DIR/.env.prod $BACKUP_PATH/
    
    log "Backup created at $BACKUP_PATH"
}

# Deploy application
deploy() {
    log "Starting deployment..."
    
    cd $DEPLOY_DIR
    
    # Pull latest code
    log "Pulling latest code from repository..."
    git pull origin main
    
    # Build and deploy with zero downtime
    log "Building and deploying containers..."
    
    # Pull latest images
    docker-compose -f docker-compose.prod.yml pull
    
    # Start new containers
    docker-compose -f docker-compose.prod.yml up -d --remove-orphans
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Run health checks
    health_check
    
    # Clean up old images
    log "Cleaning up old Docker images..."
    docker image prune -f
    
    log "Deployment completed successfully!"
}

# Health check
health_check() {
    log "Running health checks..."
    
    # Check frontend
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        log "Frontend health check passed"
    else
        error "Frontend health check failed"
    fi
    
    # Check backend
    if curl -f http://localhost:8000/health &> /dev/null; then
        log "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check database
    if docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml exec -T postgres pg_isready -U studyai -d studyai_prod &> /dev/null; then
        log "Database health check passed"
    else
        error "Database health check failed"
    fi
    
    log "All health checks passed"
}

# Rollback function
rollback() {
    warn "Rolling back to previous version..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
    fi
    
    log "Rolling back to backup: $LATEST_BACKUP"
    
    # Stop current containers
    docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml down
    
    # Restore database
    docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml up -d postgres
    sleep 10
    docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml exec -T postgres psql -U studyai -d studyai_prod < $BACKUP_DIR/$LATEST_BACKUP/database.sql
    
    # Restore configuration
    cp $BACKUP_DIR/$LATEST_BACKUP/.env.prod $DEPLOY_DIR/
    
    # Start all services
    docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml up -d
    
    log "Rollback completed"
}

# Main execution
main() {
    log "Starting StudyAI deployment process..."
    
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            create_backup
            deploy
            ;;
        "rollback")
            rollback
            ;;
        "health")
            health_check
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health}"
            exit 1
            ;;
    esac
}

# Trap errors and provide rollback option
trap 'error "Deployment failed! Run: $0 rollback"' ERR

# Run main function
main "$@"