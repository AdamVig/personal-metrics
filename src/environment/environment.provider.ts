import { Injectable } from '@nestjs/common'
import dotenv from 'dotenv'

import { LogFactory, Logger } from '../logger/log-factory'

/**
 * Environment variables.
 * @description Must match `.env.example`.
 */
export interface Environment {
  /** Environment the application is running in. */
  NODE_ENV: string
  /** Port to run the application on. */
  APP_PORT: string
  /** Port to run Grafana on. */
  GRAFANA_PORT: string
  /** Port to run the database on. */
  DB_PORT: string
  /** Username for read/write database user. Will also be used as name of database. */
  DB_USER: string
  /** Password for read/write database user. */
  DB_PASSWORD: string
  /** Username for read-only database user. */
  DB_USER_READONLY: string
  /** Password for read-only database user. */
  DB_PASSWORD_READONLY: string
  /** API token for [Pinboard](https://pinboard.in/). */
  TOKEN_PINBOARD: string
}

/** Provider for environment variables used by the application. */
@Injectable()
export class EnvironmentProvider {
  private readonly log: Logger
  private readonly capturedVariables = new Set<keyof Environment>([
    'NODE_ENV',
    'APP_PORT',
    'GRAFANA_PORT',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_USER_READONLY',
    'DB_PASSWORD_READONLY',
    'TOKEN_PINBOARD',
  ])
  private readonly variables = new Map<keyof Environment, string>()

  public constructor(log: LogFactory) {
    this.log = log.child('Environment')
    dotenv.config()

    this.log.trace(process.env, 'environment variables')
    this.capture()
    this.log.debug(
      this.redact(EnvironmentProvider.strMapToObj(this.variables) as Environment),
      'captured variables',
    )
  }

  /**
   * Captures environment variables by assigning them as properties on this object.
   */
  private capture(): void {
    for (const name of this.capturedVariables) {
      if (process.env[name] !== undefined && process.env[name] !== '') {
        this.variables.set(name, process.env[name] as string)
      }
    }
  }

  /**
   * Validates that all captured variables are set. Throws an error if any captured variables are not set.
   */
  public validate(): void {
    for (const name of this.capturedVariables) {
      if (!this.variables.has(name)) {
        throw new Error(`variable "${name}" is not set`)
      }
    }
  }

  /**
   * Gets an environment variable by name. Throws an error if the variable is not set.
   * @param name Name of an environment variable.
   * @returns Value of an environment variable.
   */
  public get(name: keyof Environment): string {
    if (this.variables.has(name)) {
      return this.variables.get(name) as string
    }
    throw new Error(`variable "${name}" is not set`)
  }

  /** Redact sensitive variables in environment for logging purposes. */
  private redact(variables: Environment): Environment {
    const redactedVariables = { ...variables }
    const toRedact = Array.from(this.capturedVariables).filter(
      (varName): boolean => varName.includes('TOKEN') || varName.includes('PASSWORD'),
    )
    for (const varName of toRedact) {
      if (varName in variables) {
        redactedVariables[varName] = '[REDACTED]'
      }
    }

    return redactedVariables
  }

  /**
   * Convert string Maps to and from objects.
   * @see {@link http://2ality.com/2015/08/es6-map-json.html}
   */
  private static strMapToObj(strMap: Map<string, string>): object {
    let obj = Object.create(null)
    for (let [k, v] of strMap) {
      obj[k] = v
    }
    return obj
  }
}
