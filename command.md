# Command Reference

This document provides a reference for all commands available in the `project.sh` script. Use these commands to manage, build, and run the chat application.

## Table of Contents

- [Environment Options](#environment-options)
- [Installation Commands](#installation-commands)
- [Development Commands](#development-commands)
- [Build Commands](#build-commands)
- [Docker Commands](#docker-commands)
- [Utility Commands](#utility-commands)
- [Help and Information](#help-and-information)

## Environment Options

Set the environment mode for any command:

```bash
# Use development environment (default)
./project.sh [command]


# Use production environment
./project.sh -e production [command]
./project.sh --env production [command]
```

## Installation Commands

Commands for installing dependencies:

```bash
# Install all dependencies
./project.sh install

# Install only frontend dependencies
./project.sh frontend install

# Install only backend dependencies
./project.sh backend install
```

## Development Commands

Commands for development mode:

```bash
# Start both frontend and backend in development mode
./project.sh dev

# Start only frontend in development mode
./project.sh dev frontend

# Start only backend in development mode
./project.sh dev backend
```

## Build Commands

Commands for building the project:

```bash
# Build all projects
./project.sh build

# Build only frontend
./project.sh frontend build

# Build only backend
./project.sh backend build
```

## Start Commands

Commands for starting the application:

```bash
# Start frontend application
./project.sh frontend start

# Start backend application
./project.sh backend start
```

## Docker Commands

Commands for Docker operations:

```bash
# Build Docker containers
./project.sh docker build

# Start Docker containers
./project.sh docker start

# Stop Docker containers
./project.sh docker stop

# Restart Docker containers
./project.sh docker restart

# View Docker logs
./project.sh docker logs
```

## Utility Commands

Utility commands for project maintenance:

```bash
# Update all dependencies
./project.sh update

# Update frontend dependencies
./project.sh frontend update

# Update backend dependencies
./project.sh backend update

# Clean all node_modules directories
./project.sh clean

# Clean frontend node_modules
./project.sh frontend clean

# Clean backend node_modules
./project.sh backend clean
```

## Help and Information

Display help information:

```bash
# Show help information
./project.sh --help
./project.sh -h
```

## Examples

Common usage examples:

```bash
# Full development setup
./project.sh install && ./project.sh dev

# Production deployment with Docker
./project.sh -e production install
./project.sh -e production build
./project.sh docker build
./project.sh docker start

# Update and rebuild
./project.sh update
./project.sh build
```

## Environment Configuration

When running installation commands, you'll be prompted to set up environment variables if they don't exist:

```bash
# Set up frontend environment
./project.sh frontend install

# Set up backend environment
./project.sh backend install
```

This will guide you through creating and configuring the necessary `.env` files for both frontend and backend services.
