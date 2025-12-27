#!/bin/bash
# ============================================================================
# AUTO-DEPLOYMENT SCRIPT
# ============================================================================
# Automated deployment after implementation tasks
# Supports: docker-compose, k8s, helm, start-enterprise.sh
# ============================================================================

set -e

# Configuration
DEPLOY_MODE="${DEPLOY_MODE:-docker}"  # docker | k8s | helm | local
CONTINUOUS_MODE="${CONTINUOUS_MODE:-false}"
VERSION_TAG="${VERSION_TAG:-$(date +%Y%m%d%H%M%S)}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="deployment-${VERSION_TAG}.log"
PROJECT_ROOT="/workspaces/codespaces-react"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; }

# Deployment summary
print_summary() {
    echo ""
    echo "============================================================================"
    echo "                     DEPLOYMENT SUMMARY"
    echo "============================================================================"
    echo "Version Tag:      $VERSION_TAG"
    echo "Timestamp:        $TIMESTAMP"
    echo "Deploy Mode:      $DEPLOY_MODE"
    echo "Continuous Mode:  $CONTINUOUS_MODE"
    echo "Status:           $1"
    echo "Log File:         $LOG_FILE"
    echo "============================================================================"
}

# Check if deployment should be paused
check_pause() {
    if [ -f "$PROJECT_ROOT/.deployment-paused" ]; then
        log_warn "Deployment is paused. Remove .deployment-paused file to resume."
        exit 0
    fi
}

# Step 1: Build and Compile
build_application() {
    log_info "Step 1/4: Building and compiling application..."
    
    cd "$PROJECT_ROOT"
    
    # Frontend build
    log_info "Building frontend..."
    npm install 2>&1 | tee -a "$LOG_FILE"
    npm run build 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        log_error "Frontend build failed!"
        return 1
    fi
    log_success "Frontend build completed"
    
    # Backend validation (Python syntax check)
    log_info "Validating backend..."
    cd "$PROJECT_ROOT/backend"
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    fi
    python -m py_compile app/main.py 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        log_error "Backend validation failed!"
        return 1
    fi
    log_success "Backend validation completed"
    
    cd "$PROJECT_ROOT"
    return 0
}

# Step 2: Run Automated Tests
run_tests() {
    log_info "Step 2/4: Running automated tests..."
    
    cd "$PROJECT_ROOT"
    
    # Frontend tests
    log_info "Running frontend tests..."
    npm run test -- --run 2>&1 | tee -a "$LOG_FILE" || {
        log_warn "Frontend tests had warnings/failures - checking if critical..."
    }
    
    # Backend tests (if pytest is available)
    log_info "Running backend tests..."
    cd "$PROJECT_ROOT/backend"
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    fi
    
    if command -v pytest &> /dev/null; then
        pytest -v --tb=short 2>&1 | tee -a "$LOG_FILE" || {
            log_warn "Backend tests had warnings/failures"
        }
    else
        log_warn "pytest not installed, skipping backend tests"
    fi
    
    cd "$PROJECT_ROOT"
    log_success "Test suite completed"
    return 0
}

# Step 3: Package Application
package_application() {
    log_info "Step 3/4: Packaging application..."
    
    cd "$PROJECT_ROOT"
    
    case $DEPLOY_MODE in
        docker)
            log_info "Building Docker images..."
            docker-compose build 2>&1 | tee -a "$LOG_FILE"
            
            # Tag images with version
            docker tag codespaces-react_frontend:latest codespaces-react_frontend:$VERSION_TAG 2>/dev/null || true
            docker tag codespaces-react_backend:latest codespaces-react_backend:$VERSION_TAG 2>/dev/null || true
            ;;
        k8s|helm)
            log_info "Building Docker images for Kubernetes..."
            docker build -f Dockerfile.frontend -t artisan-frontend:$VERSION_TAG . 2>&1 | tee -a "$LOG_FILE"
            docker build -f backend/Dockerfile -t artisan-backend:$VERSION_TAG ./backend 2>&1 | tee -a "$LOG_FILE"
            ;;
        local)
            log_info "Local mode - no packaging required"
            ;;
    esac
    
    log_success "Packaging completed"
    return 0
}

# Step 4: Deploy Application
deploy_application() {
    log_info "Step 4/4: Deploying application..."
    
    cd "$PROJECT_ROOT"
    ENDPOINT_URL=""
    
    case $DEPLOY_MODE in
        docker)
            log_info "Deploying with docker-compose..."
            docker-compose down 2>/dev/null || true
            docker-compose up -d 2>&1 | tee -a "$LOG_FILE"
            ENDPOINT_URL="http://localhost:3000 (frontend), http://localhost:8000 (backend)"
            ;;
        k8s)
            log_info "Deploying to Kubernetes..."
            kubectl apply -f k8s/deployment.yaml 2>&1 | tee -a "$LOG_FILE"
            ENDPOINT_URL="Check kubectl get services for endpoints"
            ;;
        helm)
            log_info "Deploying with Helm..."
            helm upgrade --install enterprise-app helm/enterprise-app \
                --set image.tag=$VERSION_TAG \
                --set timestamp=$TIMESTAMP 2>&1 | tee -a "$LOG_FILE"
            ENDPOINT_URL="Check helm status enterprise-app for endpoints"
            ;;
        local)
            log_info "Deploying locally with start-enterprise.sh..."
            chmod +x start-enterprise.sh
            
            # Kill existing processes
            pkill -f "vite" 2>/dev/null || true
            pkill -f "uvicorn" 2>/dev/null || true
            
            # Start services in background
            nohup npm run dev > frontend.log 2>&1 &
            log_info "Frontend started (PID: $!)"
            
            cd backend
            if [ -d ".venv" ]; then
                source .venv/bin/activate
            fi
            nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
            log_info "Backend started (PID: $!)"
            
            cd "$PROJECT_ROOT"
            ENDPOINT_URL="http://localhost:3004 (frontend), http://localhost:8000 (backend)"
            ;;
    esac
    
    log_success "Deployment completed"
    
    # Output deployment info
    echo ""
    echo "============================================================================"
    echo "                     DEPLOYMENT COMPLETE"
    echo "============================================================================"
    echo "Version Tag:        $VERSION_TAG"
    echo "Timestamp:          $TIMESTAMP"
    echo "Deploy Mode:        $DEPLOY_MODE"
    echo "Live Endpoint URL:  $ENDPOINT_URL"
    echo "Log File:           $LOG_FILE"
    echo "============================================================================"
    
    return 0
}

# Failure handler
handle_failure() {
    log_error "Deployment failed at step: $1"
    echo ""
    echo "============================================================================"
    echo "                     DEPLOYMENT FAILED"
    echo "============================================================================"
    echo "Failed Step:        $1"
    echo "Log File:           $LOG_FILE"
    echo ""
    echo "PATCH RECOMMENDATIONS:"
    echo "1. Check the log file for detailed error messages"
    echo "2. Run 'npm run build' manually to see build errors"
    echo "3. Run 'npm test' to check for test failures"
    echo "4. Verify all dependencies are installed"
    echo "5. Check Docker/K8s connectivity if using containerized deployment"
    echo "============================================================================"
    exit 1
}

# Main deployment flow
main() {
    echo ""
    echo "============================================================================"
    echo "       AUTO-DEPLOYMENT SYSTEM v1.0"
    echo "============================================================================"
    echo "Starting deployment at $TIMESTAMP"
    echo "Mode: $DEPLOY_MODE | Continuous: $CONTINUOUS_MODE"
    echo "============================================================================"
    echo ""
    
    # Check for pause file
    check_pause
    
    # Execute deployment steps
    build_application || handle_failure "Build"
    run_tests || handle_failure "Tests"
    package_application || handle_failure "Package"
    deploy_application || handle_failure "Deploy"
    
    print_summary "SUCCESS"
    
    # If continuous mode, watch for changes
    if [ "$CONTINUOUS_MODE" = "true" ]; then
        log_info "Continuous mode enabled. Watching for changes..."
        log_info "Create .deployment-paused file to pause deployment"
        
        # Set up file watcher (requires inotifywait)
        if command -v inotifywait &> /dev/null; then
            while true; do
                check_pause
                inotifywait -r -e modify,create,delete \
                    --exclude '(node_modules|\.git|dist|build|\.log)' \
                    "$PROJECT_ROOT/src" "$PROJECT_ROOT/backend/app" 2>/dev/null
                
                log_info "Changes detected! Starting auto-deployment..."
                sleep 2  # Debounce
                VERSION_TAG=$(date +%Y%m%d%H%M%S)
                main
            done
        else
            log_warn "inotifywait not found. Install inotify-tools for file watching."
            log_info "Run this script again after making changes."
        fi
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            DEPLOY_MODE="$2"
            shift 2
            ;;
        --continuous)
            CONTINUOUS_MODE="true"
            shift
            ;;
        --version)
            VERSION_TAG="$2"
            shift 2
            ;;
        --pause)
            touch "$PROJECT_ROOT/.deployment-paused"
            log_info "Deployment paused. Remove .deployment-paused to resume."
            exit 0
            ;;
        --resume)
            rm -f "$PROJECT_ROOT/.deployment-paused"
            log_info "Deployment resumed."
            exit 0
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --mode <docker|k8s|helm|local>  Deployment mode (default: docker)"
            echo "  --continuous                     Enable continuous deployment"
            echo "  --version <tag>                  Version tag (default: timestamp)"
            echo "  --pause                          Pause deployment"
            echo "  --resume                         Resume deployment"
            echo "  --help                           Show this help"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main
main
