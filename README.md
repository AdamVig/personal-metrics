# Personal Metrics

Service to capture, store, and display personal metrics.

## Usage
### Dependencies
- [`docker`](https://docs.docker.com/install/)
- [`docker-compose`](https://docs.docker.com/compose/install/)

### Scripts
- `./scripts/start` to run services and backend
- `./scripts/stop` to stop services and backend
- `npm start` to run the backend only
- `./scripts/build` to build the backend Docker container only
- `./scripts/dev` to run services for development (must run `npm start` separately)

## Architecture
[Docker Compose](https://docs.docker.com/compose) is used to orchestrate the following services:
- PostgreSQL with the [TimescaleDB](https://docs.timescale.com) extension for data storage
- [Grafana](https://grafana.com/docs/) for data visualization
- a Node.JS backend built with `./Dockerfile` for data ingestion
