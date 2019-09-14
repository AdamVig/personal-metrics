/** Duration in seconds. */
export type Duration = number

/** Monitors a data source by checking it at a set interval. */
export abstract class Monitor {
  /**
   * Interval between checks in seconds. Defaults to one hour.
   * @default 3600
   */
  public readonly interval: Duration = 3600

  /**
   * Get the latest data from the data source and insert it into the database.
   * @description This method must cancel asynchronous operations after a timeout. [[TaskQueue]] implements a "last
   * resort" timeout that will prevent slow updates from halting the queue, but it _will not cancel the operation_.
   */
  public abstract update(): Promise<void>
}
