/** Abstract class that interacts with some type of data storage (database, file, etc.). */
export abstract class DataStorage {
  public constructor(protected readonly env: Environment) {}

  abstract store(datum: number|string|boolean): Promise<void>;
}
