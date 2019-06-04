# Personal Metrics

Service to capture, store, and display personal metrics.

## Usage
### Dependencies
- [`docker`](https://docs.docker.com/install/)
- [`docker-compose`](https://docs.docker.com/compose/install/)

### Configuration
Copy `.env.example` to `.env` and set a value for each variable. These variables will be used in `docker-compose.yml` and in the Node.JS application.

### Scripts
- `./scripts/start` to run services and application
- `./scripts/stop` to stop services and application

## Development
### Scripts
- `npm start` to run the application only
- `./scripts/build` to build the application Docker container only
- `./scripts/dev` to run services for development (must run `npm start` separately)
- `npm run docs` to generate documentation (available at `/docs`)

### Architecture
[Docker Compose](https://docs.docker.com/compose) is used to orchestrate the following services:
- PostgreSQL with the [TimescaleDB](https://docs.timescale.com) extension for data storage
- [Grafana](https://grafana.com/docs/) for data visualization
- a Node.JS application built with `./Dockerfile` for data ingestion
