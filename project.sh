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
    echo -e "  dev                       Start both frontend and backend in development mode"
    echo -e "  dev frontend              Start only frontend in development mode"
    echo -e "  dev backend               Start only backend in development mode"
    echo -e "  frontend                  Run commands only for frontend"
    echo -e "  backend                   Run commands only for backend"
    echo -e "  docker                    Manage Docker environments"
    echo
    echo -e "${BLUE}Examples:${NC}"
    echo -e "  ./project.sh install                    # Install all dependencies in development mode"
    echo -e "  ./project.sh -e production install      # Install all dependencies in production mode"
    echo -e "  ./project.sh frontend install           # Install only frontend dependencies"
    echo -e "  ./project.sh dev                        # Start both frontend and backend in development mode"
    echo -e "  ./project.sh dev frontend               # Start only frontend in development mode"
    echo -e "  ./project.sh dev backend                # Start only backend in development mode"
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

# Function to start frontend in development mode
start_frontend_dev() {
    log "info" "Starting frontend in development mode..."
    cd "$FRONTEND_DIR" || exit 1
    npm run start || npm run dev
    cd - || exit 1
}

# Function to start backend in development mode
start_backend_dev() {
    log "info" "Starting backend in development mode..."
    cd "$BACKEND_NESTJS_DIR" || exit 1
    npm run start:dev
    cd - || exit 1
}

# Function to start both frontend and backend in development mode
start_dev_mode() {
    local component=$1
    
    case $component in
        "frontend")
            start_frontend_dev
            ;;
        "backend")
            start_backend_dev
            ;;
        *)
            # Start both using tmux or background processes
            log "info" "Starting both frontend and backend in development mode..."
            
            # Check if tmux is installed
            if command_exists tmux; then
                # Start a new tmux session
                tmux new-session -d -s chat-app
                
                # Split the window horizontally
                tmux split-window -h
                
                # Run frontend in the left pane
                tmux send-keys -t chat-app:0.0 "cd $FRONTEND_DIR && npm run start" C-m
                
                # Run backend in the right pane
                tmux send-keys -t chat-app:0.1 "cd $BACKEND_NESTJS_DIR && npm run start:dev" C-m
                
                # Attach to the tmux session
                tmux attach-session -t chat-app
                
                log "success" "Development servers started in tmux session"
            else
                # Alternative method using background processes if tmux is not available
                log "warning" "tmux not found, using background processes instead"
                log "info" "Starting backend in the background..."
                
                # Start the backend in the background
                (cd "$BACKEND_NESTJS_DIR" && npm run start:dev) &
                BACKEND_PID=$!
                
                # Wait a moment to allow backend to start
                sleep 5
                
                log "info" "Starting frontend..."
                # Start the frontend in the foreground
                cd "$FRONTEND_DIR" && npm run start
                
                # Kill the backend process when the frontend is stopped
                kill $BACKEND_PID
            fi
            ;;
    esac
}

# Function to prompt for environment variable setup
setup_user_env() {
    local target=$1
    
    case $target in
        "frontend")
            if [[ ! -f "$FRONTEND_DIR/.env" ]]; then
                log "info" "Frontend .env file not found"
                read -p "Would you like to create a frontend environment file? (y/n): " create_env
                
                if [[ "$create_env" == "y" || "$create_env" == "Y" ]]; then
                    # Check if .env.example exists
                    if [[ -f "$FRONTEND_DIR/.env.example" ]]; then
                        cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
                        log "info" "Frontend .env file created from example"
                    else
                        # Create a default frontend .env
                        cat > "$FRONTEND_DIR/.env" << EOF
# API URL (Required)
REACT_APP_API_URL=http://localhost:9000
# or
VITE_API_URL=http://localhost:9000

# Public environment variables for React/Vue
NODE_ENV=development
EOF
                        log "info" "Default frontend .env file created"
                    fi
                    
                    log "info" "Please edit $FRONTEND_DIR/.env with your settings"
                    read -p "Press enter to open the file for editing (or n to skip): " edit_now
                    
                    if [[ "$edit_now" != "n" && "$edit_now" != "N" ]]; then
                        # Try to open with available editors
                        if command_exists nano; then
                            nano "$FRONTEND_DIR/.env"
                        elif command_exists vim; then
                            vim "$FRONTEND_DIR/.env"
                        elif command_exists vi; then
                            vi "$FRONTEND_DIR/.env"
                        else
                            log "warning" "No suitable editor found. Please edit $FRONTEND_DIR/.env manually."
                        fi
                    fi
                    
                    log "success" "Frontend environment setup completed"
                else
                    log "warning" "Frontend environment setup skipped"
                fi
            fi
            ;;
            
        "backend")
            # For NestJS backend
            if [[ ! -f "$BACKEND_NESTJS_DIR/.env" ]]; then
                log "info" "NestJS backend .env file not found"
                read -p "Would you like to create a NestJS backend environment file? (y/n): " create_env
                
                if [[ "$create_env" == "y" || "$create_env" == "Y" ]]; then
                    # Check if .env.example exists first
                    if [[ -f "$BACKEND_NESTJS_DIR/.env.example" ]]; then
                        cp "$BACKEND_NESTJS_DIR/.env.example" "$BACKEND_NESTJS_DIR/.env"
                        log "info" "NestJS backend .env file created from example"
                    else
                        # Create a default .env file if no example exists
                        log "info" "Creating default backend .env file"
                    fi
                    
                    # Prompt for mandatory SMTP settings regardless of whether we copied from example
                    log "info" "Setting up mandatory SMTP configuration..."
                    
                    # SMTP Host
                    while true; do
                        read -p "Enter SMTP host (required): " smtp_host
                        if [[ -n "$smtp_host" ]]; then
                            break
                        else
                            log "error" "SMTP host is required"
                        fi
                    done
                    
                    # SMTP Port
                    while true; do
                        read -p "Enter SMTP port (required): " smtp_port
                        if [[ -n "$smtp_port" && "$smtp_port" =~ ^[0-9]+$ ]]; then
                            break
                        else
                            log "error" "A valid SMTP port is required (numbers only)"
                        fi
                    done
                    
                    # SMTP User
                    while true; do
                        read -p "Enter SMTP username/email (required): " smtp_user
                        if [[ -n "$smtp_user" ]]; then
                            break
                        else
                            log "error" "SMTP username is required"
                        fi
                    done
                    
                    # SMTP Password
                    while true; do
                        read -sp "Enter SMTP password (required): " smtp_password
                        echo
                        if [[ -n "$smtp_password" ]]; then
                            break
                        else
                            log "error" "SMTP password is required"
                        fi
                    done
                    
                    # SMTP From Name
                    while true; do
                        read -p "Enter SMTP from name (required): " smtp_from_name
                        if [[ -n "$smtp_from_name" ]]; then
                            break
                        else
                            log "error" "SMTP from name is required"
                        fi
                    done
                    
                    # If we didn't copy from example, create a complete .env file
                    if [[ ! -f "$BACKEND_NESTJS_DIR/.env.example" ]]; then
                        # Create a default .env file with common NestJS variables and SMTP config
                        cat > "$BACKEND_NESTJS_DIR/.env" << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=chat_app

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRATION_TIME=3600

# Application Configuration
PORT=9000
NODE_ENV=development

# SMTP Configuration (Required)
SMTP_HOST=$smtp_host
SMTP_PORT=$smtp_port
SMTP_USER=$smtp_user
SMTP_PASSWORD=$smtp_password
SMTP_FROM_NAME=$smtp_from_name
EOF
                        log "info" "Default NestJS backend .env file created with SMTP configuration"
                    else
                        # If we copied from example, ensure SMTP settings are in the file
                        # First check if SMTP settings are already in the file
                        if ! grep -q "SMTP_HOST" "$BACKEND_NESTJS_DIR/.env"; then
                            # Append SMTP settings if not present
                            {
                                echo ""
                                echo "# SMTP Configuration (Required)"
                                echo "SMTP_HOST=$smtp_host"
                                echo "SMTP_PORT=$smtp_port"
                                echo "SMTP_USER=$smtp_user"
                                echo "SMTP_PASSWORD=$smtp_password"
                                echo "SMTP_FROM_NAME=$smtp_from_name"
                            } >> "$BACKEND_NESTJS_DIR/.env"
                            log "info" "SMTP configuration added to .env file"
                        else
                            # If SMTP settings exist, update them
                            sed -i "s/SMTP_HOST=.*/SMTP_HOST=$smtp_host/" "$BACKEND_NESTJS_DIR/.env"
                            sed -i "s/SMTP_PORT=.*/SMTP_PORT=$smtp_port/" "$BACKEND_NESTJS_DIR/.env"
                            sed -i "s/SMTP_USER=.*/SMTP_USER=$smtp_user/" "$BACKEND_NESTJS_DIR/.env"
                            sed -i "s/SMTP_PASSWORD=.*/SMTP_PASSWORD=$smtp_password/" "$BACKEND_NESTJS_DIR/.env"
                            sed -i "s/SMTP_FROM_NAME=.*/SMTP_FROM_NAME=$smtp_from_name/" "$BACKEND_NESTJS_DIR/.env"
                            log "info" "SMTP configuration updated in .env file"
                        fi
                    fi
                    
                    log "info" "Please review the rest of the $BACKEND_NESTJS_DIR/.env file with your settings"
                    read -p "Press enter to open the file for editing (or n to skip): " edit_now
                    
                    if [[ "$edit_now" != "n" && "$edit_now" != "N" ]]; then
                        # Try to open with available editors
                        if command_exists nano; then
                            nano "$BACKEND_NESTJS_DIR/.env"
                        elif command_exists vim; then
                            vim "$BACKEND_NESTJS_DIR/.env"
                        elif command_exists vi; then
                            vi "$BACKEND_NESTJS_DIR/.env"
                        else
                            log "warning" "No suitable editor found. Please edit $BACKEND_NESTJS_DIR/.env manually."
                        fi
                    fi
                    
                    log "success" "NestJS backend environment setup completed"
                else
                    log "warning" "NestJS backend environment setup skipped"
                fi
            fi
            
            # Check for other backend directory if it exists
            if [[ -d "$BACKEND_OTHER_DIR" && ! -f "$BACKEND_OTHER_DIR/.env" ]]; then
                log "info" "Other backend .env file not found"
                read -p "Would you like to set up the other backend environment variables? (y/n): " setup_env
                
                if [[ "$setup_env" == "y" || "$setup_env" == "Y" ]]; then
                    if [[ -f "$BACKEND_OTHER_DIR/.env.example" ]]; then
                        cp "$BACKEND_OTHER_DIR/.env.example" "$BACKEND_OTHER_DIR/.env"
                        log "info" "Other backend .env file created from example"
                    else
                        # Create a simple default .env file for other backend
                        cat > "$BACKEND_OTHER_DIR/.env" << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=chat_app

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRATION_TIME=3600

# Application Configuration
PORT=3001  # Different from NestJS backend
NODE_ENV=development
EOF
                        log "info" "Default other backend .env file created"
                    fi
                    
                    log "info" "Please edit $BACKEND_OTHER_DIR/.env with your settings"
                    read -p "Press enter to open the file for editing (or n to skip): " edit_now
                    
                    if [[ "$edit_now" != "n" && "$edit_now" != "N" ]]; then
                        # Try to open with available editors
                        if command_exists nano; then
                            nano "$BACKEND_OTHER_DIR/.env"
                        elif command_exists vim; then
                            vim "$BACKEND_OTHER_DIR/.env"
                        elif command_exists vi; then
                            vi "$BACKEND_OTHER_DIR/.env"
                        else
                            log "warning" "No suitable editor found. Please edit $BACKEND_OTHER_DIR/.env manually."
                        fi
                    fi
                    
                    log "success" "Other backend environment setup completed"
                else
                    log "warning" "Other backend environment setup skipped"
                fi
            fi
            ;;
            
        "all")
            setup_user_env "frontend"
            setup_user_env "backend"
            ;;
    esac
}

# Function to install dependencies
install_deps() {
    local target=$1
    local prod_flag=""
    
    if [[ "$ENV" == "production" ]]; then
        prod_flag="--production"
    fi
    
    # First, set up the environment variables
    setup_user_env "$target"
    
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
        frontend|backend|install|update|clean|build|start|docker|dev)
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
    "dev")
        if [[ $# -gt 1 ]]; then
            case $2 in
                "frontend") start_dev_mode "frontend" ;;
                "backend") start_dev_mode "backend" ;;
                *)
                    log "error" "Unknown target for dev command: $2"
                    log "info" "Available targets: frontend, backend"
                    exit 1
                    ;;
            esac
        else
            # Start both frontend and backend in dev mode
            start_dev_mode
        fi
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