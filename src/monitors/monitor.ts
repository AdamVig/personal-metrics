/** Duration in seconds. */
export type Duration = number

/** Monitors a data source by checking it at a set interval. */
export abstract class Monitor {
  /**
   * Interval between checks. Defaults to one hour.
   * @default 216000
   */
  public static readonly interval: Duration = 216000

  /** Fetches the latest data from the data source and inserts it into the database. */
  public abstract update(): Promise<void>
}
