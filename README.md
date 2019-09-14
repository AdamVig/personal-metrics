# Personal Metrics

Service to capture, store, and display personal metrics.

## Usage

### Dependencies

- [`docker`](https://docs.docker.com/install/)
- [`docker-compose`](https://docs.docker.com/compose/install/)

### Configuration

Copy `.env.example` to `.env` and set a value for each variable. These variables will be used in `docker-compose.yml`
and in the Node.JS application. See "Finding API Tokens" below for help filling in the variable values.

Optionally, copy `personal-metrics.conf` to `/etc/nginx/sites-available` and enable it with

```shell
ln -s /etc/nginx/sites-available/personal-metrics.conf /etc/nginx/sites-enabled/personal-metrics.conf
```

#### Docker Compose Overrides

To override parts of the Docker Compose configuration, create a file on the server called `docker-compose.override.yml`.
See [the Docker Compose documentation](https://docs.docker.com/compose/extends/) for more details on file overrides.

For example, to set up [Papertrail
logging](https://help.papertrailapp.com/kb/configuration/configuring-centralized-logging-from-docker/#docker-compose)
for the `app` container:

```yml
version: '3.2'
services:
  app:
    logging:
      driver: syslog
      options:
        syslog-address: 'udp://logsX.papertrailapp.com:XXXX'
        tag: 'personal-metrics'
```

### Scripts

- `./scripts/start` to run services and application
- `./scripts/stop` to stop services and application
- `./scripts/bootstrap` to run one-time setup on the server
- `./scripts/publish` to build and publish to Docker Hub
- `./scripts/post-receive` to check out code and restart services/application on a remote host
  - To use this script, the remote host must have a bare Git repository: `git clone --bare https://github.com/AdamVig/personal-metrics.git`
  - The script should be places in that bare Git repository at `./hooks/post-receive` and made executable with
    `chmod +x ./hooks/post-receive`.

### Deployment

1. Locally, run `./scripts/publish` to build and publish the application to Docker Hub.
2. Push the latest source code to the server and update the remote `.env` if necessary.
3. On the server, navigate to the source code directory and run `./scripts/stop` then `./scripts/start`.

### Adding a Grafana Data Source

Grafana must communicate with the Postgres Docker container via the Docker Compose network. The connection configuration
should be as follows:

| Field       | Value/Variable         |
| ----------- | ---------------------- |
| Host        | postgres:5432          |
| Database    | `DB_USER`              |
| User        | `DB_USER_READONLY`     |
| Password    | `DB_PASSWORD_READONLY` |
| SSL Mode    | disable                |
| Version     | 10                     |
| TimescaleDB | yes                    |

## Development

### Scripts

- `npm start` to run the application only
- `./scripts/build` to build the application Docker container only
- `./scripts/dev` to run services for development and `npm start`
- `./scripts/db` to connect to the database using variables from `.env`
- `npm run docs` to generate documentation (available at `/docs`)

### TypeORM

- [Documentation](https://typeorm.io/)
- Use the CLI via `npm run typeorm --`.
  - Create an empty migration: `npm run typeorm -- migration:create --dir src/migrations --name foo`
  - Generate a migration for entities added since the last migration: `npm run typeorm -- migration:generate --dir src/migrations --name foo`

### Architecture

[Docker Compose](https://docs.docker.com/compose) is used to orchestrate the following services:

- PostgreSQL with the [TimescaleDB](https://docs.timescale.com) extension for data storage
- [Grafana](https://grafana.com/docs/) for data visualization
- a Node.JS application built with `./Dockerfile` for data ingestion

## Finding API Tokens

- [Pinboard](https://pinboard.in/settings/password)
