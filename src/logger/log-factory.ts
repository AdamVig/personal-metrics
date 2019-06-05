import pino from 'pino'

export type Logger = pino.Logger

export class LogFactory {
  private readonly log = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: {},
    prettyPrint: process.env.NODE_ENV !== 'production',
  })

  /**
   * Create a child logger.
   * @param name Name of the component to create a child logger for
   * @returns A child logger.
   */
  public child(name: string): Logger {
    return this.log.child({ name })
  }
}
