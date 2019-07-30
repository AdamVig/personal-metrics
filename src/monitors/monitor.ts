/** Duration in seconds. */
export type Duration = number

/** Monitors a data source by checking it at a set interval. */
export abstract class Monitor {
  /**
   * Interval between checks. Defaults to one hour.
   * @default 3600
   */
  public readonly interval: Duration = 3600

  /** Get the latest data from the data source and inserts it into the database. */
  public abstract update(): Promise<void>

  /**
   * Get the time of the last update.
   * @return Time of last update or `null` if no previous updates are found.
   */
  public abstract getLastUpdateTime(): Date | null
}
