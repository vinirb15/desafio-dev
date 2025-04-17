# Programming Challenge

# Project Setup and Execution with Docker Compose

This repository contains both the **API** and **Web** components of the project. This guide will help you get everything up and running using **Docker Compose**.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (Docker Engine + Docker Compose)

Make sure Docker are installed and running properly on your machine before proceeding.

## Project Structure

- **/api** -- Backend API that powers the business logic.
- **/web** -- Frontend Web Application.
- **docker-compose.yml** -- The Docker Compose configuration that orchestrates the services.

## Setup

Follow these steps to get the project running.

### 1. Clone the Repository

```bash
git clone https://github.com/vinirb15/desafio-dev.git
cd desafio-dev
```

### 2. Build and Run the Containers
```bash
docker-compose up -d --build
```

## Others Documentations
- [API Documentation](./api/README.md)
- [Web Documentation](./web/README.md)

## Temporary Demonstration
- [Web](https://web.srv.vbueno.com.br)
- [Api](https://api.srv.vbueno.com.br/api)
