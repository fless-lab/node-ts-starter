# Node.js TypeScript Starter Project

This project is a simple and lightweight Node.js boilerplate using TypeScript. It includes Docker configurations to run the application in both development and production modes. 

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Project Structure](#project-structure)
5. [Scripts Explanation](#scripts-explanation)
6. [Environment Variables](#environment-variables)
7. [Docker Configuration](#docker-configuration)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 18 or above)
- Docker
- Docker Compose

## Installation

To set up the project, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/node-ts-starter.git
    cd node-ts-starter
    ```

2. **Run the installation script**:
    ```sh
    bash bin/install.sh
    ```

    This script will:
    - Copy the `.env.example` file to `.env`.
    - Install the necessary npm dependencies.

## Running the Application

You can run the application in either development or production mode.

### Development Mode

To run the application in development mode:
```sh
bash bin/start.sh
```

### Production Mode

To run the application in production mode:
```sh
bash bin/start.sh --prod
```

## Project Structure

Here is an overview of the project's structure:
```
/home/raouf/workspaces/personnal/projects/node-ts-starter
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
├── .env (generated)
├── bin
│   ├── install.sh
│   └── start.sh
├── src
│   ├── config
│   │   └── index.ts
│   ├── app
│   │   ├── controllers
│   │   ├── services
│   │   ├── utils
│   │   ├── models
│   │   ├── repositories
│   │   └── routes
│   ├── constants
│   ├── templates
│   ├── helpers
│   ├── server.ts
│   └── framework
│       ├── database
│       ├── webserver
│       └── storage
```

## Scripts Explanation

### `bin/install.sh`

This script sets up the project by performing the following tasks:
- Copies the `.env.example` file to `.env`, replacing any existing `.env` file.
- Installs npm dependencies.

### `bin/start.sh`

This script runs the application by performing the following tasks:
- Checks if Docker and Docker Compose are installed.
- Runs the `install.sh` script to ensure dependencies are installed.
- Sets the `NODE_ENV` environment variable based on the provided argument (`--prod` for production).
- Starts the Docker containers using Docker Compose.

### Dockerfile

The Dockerfile defines how the Docker image is built. It includes steps for setting up the working directory, installing dependencies, copying the source code, building the TypeScript project, and defining the startup command.

### docker-compose.yml

This file defines the Docker services for the application, including the application itself, MongoDB, Redis, MinIO, and Maildev. It uses environment variables from the `.env` file to configure the services.

## Environment Variables

The `.env` file contains the environment variables required by the application. It is generated from the `.env.example` file during installation. Ensure the following variables are set:

```env
# Engine
PORT=9095

# Database
DB_URI=mongodb://mongo:27017
DB_NAME=mydatabase

# Cache
REDIS_HOST=redis
REDIS_PORT=6379

# MinIO
MINIO_ENDPOINT=minio
MINIO_ACCESS_KEY=minio-access-key
MINIO_SECRET_KEY=minio-secret-key
MINIO_API_PORT=9500
MINIO_CONSOLE_PORT=9050

# Maildev
MAILDEV_HOST=maildev
MAILDEV_PORT=1025
```

## Docker Configuration

The Docker configuration allows the application to run in isolated containers. The services defined in `docker-compose.yml` include:

- **app**: The main Node.js application.
- **mongo**: MongoDB database service.
- **redis**: Redis caching service.
- **minio**: MinIO object storage service.
- **maildev**: Maildev service for testing email sending.

### Building and Starting Docker Containers

To build and start the Docker containers, run:

```sh
docker-compose up --build
```

This command will build the Docker images and start the services defined in `docker-compose.yml`.
