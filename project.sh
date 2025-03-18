#!/bin/bash

# project.sh
# Script to manage project dependencies and environment setup
# Handles both development and production environments

set -e # Exit on error

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
FRONTEND_DIR="front-end/chat-website"
BACKEND_NESTJS_DIR="back-end/chat-app-nestjs"
BACKEND_OTHER_DIR="back-end/chat_app"

# Default environment
ENV="development"

# Function to display usage information
show_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  ./project.sh [options] [command]"
    echo
    echo -e "${BLUE}Options:${NC}"
    echo -e "  -e, --env <environment>   Set environment (development/production), default: development"
    echo -e "  -h, --help                Show this help message"
    echo
    echo -e "${BLUE}Commands:${NC}"
    echo -e "  install                   Install all dependencies"
    echo -e "  update                    Update all dependencies"
    echo -e "  clean                     Clean all dependencies (node_modules)"
    echo -e "  build                     Build all projects"
    echo -e "  start                     Start all projects"
    echo -e "  frontend                  Run commands only for frontend"
    echo -e "  backend                   Run commands only for backend"
    echo -e "  docker                    Manage Docker environments"
    echo
    echo -e "${BLUE}Examples:${NC}"
    echo -e "  ./project.sh install                    # Install all dependencies in development mode"
    echo -e "  ./project.sh -e production install      # Install all dependencies in production mode"
    echo -e "  ./project.sh frontend install           # Install only frontend dependencies"
    echo -e "  ./project.sh docker start               # Start Docker containers"
}

# Function to log messages
log() {
    local level=$1
    local message=$2
    local color=$NC
    
    case $level in
        "info") color=$BLUE ;;
        "success") color=$GREEN ;;
        "warning") color=$YELLOW ;;
        "error") color=$RED ;;
    esac
    
    echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check required tools
check_requirements() {
    log "info" "Checking required tools..."
    
    local missing_tools=()
    
    # Check Node.js
    if ! command_exists node; then
        missing_tools+=("Node.js")
    else
        log "success" "Node.js $(node -v) is installed"
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_tools+=("npm")
    else
        log "success" "npm $(npm -v) is installed"
    fi
    
    # Check Docker if needed
    if [[ "$ENV" == "production" || "$1" == "docker" ]]; then
        if ! command_exists docker; then
            missing_tools+=("Docker")
        else
            log "success" "Docker is installed"
        fi
        
        if ! command_exists docker-compose; then
            missing_tools+=("docker-compose")
        else
            log "success" "docker-compose is installed"
        fi
    fi
    
    # If any tools are missing, exit
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log "error" "Missing required tools: ${missing_tools[*]}"
        log "info" "Please install the required tools and try again"
        exit 1
    fi
}

# Function to copy correct .env file based on environment
setup_env() {
    log "info" "Setting up environment for $ENV mode..."
    
    if [[ -f ".env.$ENV" ]]; then
        cp ".env.$ENV" ".env"
        log "success" "Copied .env.$ENV to .env"
    elif [[ -f ".env.example" ]]; then
        cp ".env.example" ".env"
        log "warning" "No .env.$ENV found, copied .env.example to .env instead"
    else
        log "warning" "No .env files found, skipping environment setup"
    fi
    
    # Frontend environment setup
    if [[ -f "$FRONTEND_DIR/.env.$ENV" ]]; then
        cp "$FRONTEND_DIR/.env.$ENV" "$FRONTEND_DIR/.env"
        log "success" "Copied frontend .env.$ENV to .env"
    fi
    
    # Backend environment setup
    if [[ -f "$BACKEND_NESTJS_DIR/.env.$ENV" ]]; then
        cp "$BACKEND_NESTJS_DIR/.env.$ENV" "$BACKEND_NESTJS_DIR/.env"
        log "success" "Copied backend .env.$ENV to .env"
    fi
}

# Function to install dependencies
install_deps() {
    local target=$1
    local prod_flag=""
    
    if [[ "$ENV" == "production" ]]; then
        prod_flag="--production"
    fi
    
    case $target in
        "frontend")
            log "info" "Installing frontend dependencies..."
            cd "$FRONTEND_DIR" || exit 1
            npm install $prod_flag
            cd - || exit 1
            log "success" "Frontend dependencies installed"
            ;;
        "backend")
            log "info" "Installing NestJS backend dependencies..."
            cd "$BACKEND_NESTJS_DIR" || exit 1
            npm install $prod_flag
            cd - || exit 1
            log "success" "NestJS backend dependencies installed"
            
            # Check if the other backend directory has a package.json
            if [[ -f "$BACKEND_OTHER_DIR/package.json" ]]; then
                log "info" "Installing other backend dependencies..."
                cd "$BACKEND_OTHER_DIR" || exit 1
                npm install $prod_flag
                cd - || exit 1
                log "success" "Other backend dependencies installed"
            fi
            ;;
        "all")
            install_deps "frontend"
            install_deps "backend"
            ;;
        *)
            log "error" "Unknown target: $target"
            exit 1
            ;;
    esac
}

# Function to update dependencies
update_deps() {
    local target=$1
    
    case $target in
        "frontend")
            log "info" "Updating frontend dependencies..."
            cd "$FRONTEND_DIR" || exit 1
            npm update
            cd - || exit 1
            log "success" "Frontend dependencies updated"
            ;;
        "backend")
            log "info" "Updating NestJS backend dependencies..."
            cd "$BACKEND_NESTJS_DIR" || exit 1
            npm update
            cd - || exit 1
            log "success" "NestJS backend dependencies updated"
            
            # Check if the other backend directory has a package.json
            if [[ -f "$BACKEND_OTHER_DIR/package.json" ]]; then
                log "info" "Updating other backend dependencies..."
                cd "$BACKEND_OTHER_DIR" || exit 1
                npm update
                cd - || exit 1
                log "success" "Other backend dependencies updated"
            fi
            ;;
        "all")
            update_deps "frontend"
            update_deps "backend"
            ;;
        *)
            log "error" "Unknown target: $target"
            exit 1
            ;;
    esac
}

# Function to clean dependencies
clean_deps() {
    local target=$1
    
    case $target in
        "frontend")
            log "info" "Cleaning frontend dependencies..."
            rm -rf "$FRONTEND_DIR/node_modules"
            log "success" "Frontend dependencies cleaned"
            ;;
        "backend")
            log "info" "Cleaning NestJS backend dependencies..."
            rm -rf "$BACKEND_NESTJS_DIR/node_modules"
            log "success" "NestJS backend dependencies cleaned"
            
            # Check if the other backend directory has node_modules
            if [[ -d "$BACKEND_OTHER_DIR/node_modules" ]]; then
                log "info" "Cleaning other backend dependencies..."
                rm -rf "$BACKEND_OTHER_DIR/node_modules"
                log "success" "Other backend dependencies cleaned"
            fi
            ;;
        "all")
            clean_deps "frontend"
            clean_deps "backend"
            ;;
        *)
            log "error" "Unknown target: $target"
            exit 1
            ;;
    esac
}

# Function to build projects
build_projects() {
    local target=$1
    local build_env=""
    
    if [[ "$ENV" == "production" ]]; then
        build_env="--prod"
    fi
    
    case $target in
        "frontend")
            log "info" "Building frontend..."
            cd "$FRONTEND_DIR" || exit 1
            npm run build $build_env
            cd - || exit 1
            log "success" "Frontend built"
            ;;
        "backend")
            log "info" "Building NestJS backend..."
            cd "$BACKEND_NESTJS_DIR" || exit 1
            npm run build
            cd - || exit 1
            log "success" "NestJS backend built"
            
            # Check if the other backend directory has a build script
            if [[ -f "$BACKEND_OTHER_DIR/package.json" ]]; then
                if grep -q '"build"' "$BACKEND_OTHER_DIR/package.json"; then
                    log "info" "Building other backend..."
                    cd "$BACKEND_OTHER_DIR" || exit 1
                    npm run build
                    cd - || exit 1
                    log "success" "Other backend built"
                fi
            fi
            ;;
        "all")
            build_projects "frontend"
            build_projects "backend"
            ;;
        *)
            log "error" "Unknown target: $target"
            exit 1
            ;;
    esac
}

# Function to start projects
start_projects() {
    local target=$1
    
    case $target in
        "frontend")
            log "info" "Starting frontend..."
            cd "$FRONTEND_DIR" || exit 1
            if [[ "$ENV" == "production" ]]; then
                npm run start:prod || npm run start
            else
                npm run start || npm run dev
            fi
            cd - || exit 1
            ;;
        "backend")
            log "info" "Starting NestJS backend..."
            cd "$BACKEND_NESTJS_DIR" || exit 1
            if [[ "$ENV" == "production" ]]; then
                npm run start:prod
            else
                npm run start:dev
            fi
            cd - || exit 1
            ;;
        "all")
            log "error" "Cannot start all projects simultaneously in foreground mode"
            log "info" "Please use Docker for running all components or start them individually"
            ;;
        *)
            log "error" "Unknown target: $target"
            exit 1
            ;;
    esac
}

# Function to manage Docker
manage_docker() {
    local command=$1
    
    case $command in
        "build")
            log "info" "Building Docker containers..."
            docker-compose build
            log "success" "Docker containers built"
            ;;
        "start")
            log "info" "Starting Docker containers..."
            docker-compose up -d
            log "success" "Docker containers started"
            ;;
        "stop")
            log "info" "Stopping Docker containers..."
            docker-compose down
            log "success" "Docker containers stopped"
            ;;
        "restart")
            log "info" "Restarting Docker containers..."
            docker-compose restart
            log "success" "Docker containers restarted"
            ;;
        "logs")
            log "info" "Showing Docker logs..."
            docker-compose logs -f
            ;;
        *)
            log "error" "Unknown Docker command: $command"
            log "info" "Available commands: build, start, stop, restart, logs"
            exit 1
            ;;
    esac
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENV="$2"
            if [[ "$ENV" != "development" && "$ENV" != "production" ]]; then
                log "error" "Invalid environment: $ENV"
                log "info" "Available environments: development, production"
                exit 1
            fi
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        frontend|backend|install|update|clean|build|start|docker)
            break
            ;;
        *)
            log "error" "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Execute command
log "info" "Running in $ENV mode"

# Check requirements before executing commands
check_requirements "$@"

# Setup environment
setup_env

# Process command
if [[ $# -eq 0 ]]; then
    show_usage
    exit 0
fi

case $1 in
    "frontend")
        if [[ $# -lt 2 ]]; then
            log "error" "Missing command for frontend"
            show_usage
            exit 1
        fi
        
        case $2 in
            "install") install_deps "frontend" ;;
            "update") update_deps "frontend" ;;
            "clean") clean_deps "frontend" ;;
            "build") build_projects "frontend" ;;
            "start") start_projects "frontend" ;;
            *)
                log "error" "Unknown command for frontend: $2"
                show_usage
                exit 1
                ;;
        esac
        ;;
    "backend")
        if [[ $# -lt 2 ]]; then
            log "error" "Missing command for backend"
            show_usage
            exit 1
        fi
        
        case $2 in
            "install") install_deps "backend" ;;
            "update") update_deps "backend" ;;
            "clean") clean_deps "backend" ;;
            "build") build_projects "backend" ;;
            "start") start_projects "backend" ;;
            *)
                log "error" "Unknown command for backend: $2"
                show_usage
                exit 1
                ;;
        esac
        ;;
    "install")
        install_deps "all"
        ;;
    "update")
        update_deps "all"
        ;;
    "clean")
        clean_deps "all"
        ;;
    "build")
        build_projects "all"
        ;;
    "start")
        start_projects "all"
        ;;
    "docker")
        if [[ $# -lt 2 ]]; then
            log "error" "Missing command for Docker"
            log "info" "Available commands: build, start, stop, restart, logs"
            exit 1
        fi
        
        manage_docker "$2"
        ;;
    *)
        log "error" "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac

log "success" "Command completed successfully"