/**
 * Environment variables.
 * @description Must match `.env.example`.
 */
interface Environment {
  APP_PORT: string;
  GRAFANA_PORT: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
}
