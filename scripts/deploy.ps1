# StudyAI Production Deployment Script for Windows
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("deploy", "rollback", "health")]
    [string]$Action = "deploy"
)

# Configuration
$DEPLOY_DIR = "C:\opt\studyai"
$BACKUP_DIR = "C:\opt\studyai-backups"
$LOG_FILE = "C:\var\log\studyai-deploy.log"

# Ensure log directory exists
$logDir = Split-Path $LOG_FILE -Parent
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force
}

# Functions
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage -ForegroundColor Green
    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Write-Warning {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] WARNING: $Message"
    Write-Host $logMessage -ForegroundColor Yellow
    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Write-Error {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] ERROR: $Message"
    Write-Host $logMessage -ForegroundColor Red
    Add-Content -Path $LOG_FILE -Value $logMessage
    exit 1
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check if Docker is installed
    try {
        docker --version | Out-Null
        Write-Log "Docker is installed"
    } catch {
        Write-Error "Docker is not installed or not in PATH"
    }
    
    # Check if Docker is running
    try {
        docker info | Out-Null
        Write-Log "Docker daemon is running"
    } catch {
        Write-Error "Docker daemon is not running"
    }
    
    # Check if Docker Compose is available
    try {
        docker-compose --version | Out-Null
        Write-Log "Docker Compose is available"
    } catch {
        Write-Error "Docker Compose is not installed"
    }
    
    Write-Log "Prerequisites check passed"
}

# Create backup
function New-Backup {
    Write-Log "Creating backup..."
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $BACKUP_DIR "backup_$timestamp"
    
    New-Item -ItemType Directory -Path $backupPath -Force
    
    try {
        # Backup database
        Set-Location $DEPLOY_DIR
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U studyai studyai_prod > "$backupPath\database.sql"
        
        # Backup configuration
        if (Test-Path ".env.prod") {
            Copy-Item ".env.prod" "$backupPath\"
        }
        
        Write-Log "Backup created at $backupPath"
    } catch {
        Write-Error "Backup failed: $($_.Exception.Message)"
    }
}

# Deploy application
function Start-Deployment {
    Write-Log "Starting deployment..."
    
    Set-Location $DEPLOY_DIR
    
    try {
        # Pull latest code (if git is available)
        if (Get-Command git -ErrorAction SilentlyContinue) {
            Write-Log "Pulling latest code from repository..."
            git pull origin main
        }
        
        # Build and deploy
        Write-Log "Building and deploying containers..."
        
        # Pull latest images
        docker-compose -f docker-compose.prod.yml pull
        
        # Start new containers
        docker-compose -f docker-compose.prod.yml up -d --remove-orphans
        
        # Wait for services
        Write-Log "Waiting for services to be ready..."
        Start-Sleep -Seconds 30
        
        # Run health checks
        Test-Health
        
        # Clean up old images
        Write-Log "Cleaning up old Docker images..."
        docker image prune -f
        
        Write-Log "Deployment completed successfully!"
    } catch {
        Write-Error "Deployment failed: $($_.Exception.Message)"
    }
}

# Health check
function Test-Health {
    Write-Log "Running health checks..."
    
    try {
        # Check frontend
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Log "Frontend health check passed"
        } else {
            Write-Error "Frontend health check failed"
        }
    } catch {
        Write-Error "Frontend health check failed: $($_.Exception.Message)"
    }
    
    try {
        # Check backend
        $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 10
        if ($backendResponse.StatusCode -eq 200) {
            Write-Log "Backend health check passed"
        } else {
            Write-Error "Backend health check failed"
        }
    } catch {
        Write-Error "Backend health check failed: $($_.Exception.Message)"
    }
    
    Write-Log "All health checks passed"
}

# Rollback function
function Start-Rollback {
    Write-Warning "Rolling back to previous version..."
    
    # Find latest backup
    $latestBackup = Get-ChildItem $BACKUP_DIR | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if (-not $latestBackup) {
        Write-Error "No backup found for rollback"
    }
    
    Write-Log "Rolling back to backup: $($latestBackup.Name)"
    
    try {
        Set-Location $DEPLOY_DIR
        
        # Stop current containers
        docker-compose -f docker-compose.prod.yml down
        
        # Restore configuration
        $backupConfigPath = Join-Path $latestBackup.FullName ".env.prod"
        if (Test-Path $backupConfigPath) {
            Copy-Item $backupConfigPath ".env.prod"
        }
        
        # Start services
        docker-compose -f docker-compose.prod.yml up -d
        
        Write-Log "Rollback completed"
    } catch {
        Write-Error "Rollback failed: $($_.Exception.Message)"
    }
}

# Main execution
Write-Log "Starting StudyAI deployment process..."

switch ($Action) {
    "deploy" {
        Test-Prerequisites
        New-Backup
        Start-Deployment
    }
    "rollback" {
        Start-Rollback
    }
    "health" {
        Test-Health
    }
    default {
        Write-Host "Usage: .\deploy.ps1 -Action {deploy|rollback|health}"
        exit 1
    }
}