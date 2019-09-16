import { Entity, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class TaskRun {
  @CreateDateColumn({ unique: true, update: false, primary: true })
  public time!: Date

  /** Unique ID of the task run. */
  @Column({ type: 'text', nullable: false })
  public id!: string

  /** Name of the `Monitor` that the task came from. */
  @Column({ type: 'text', name: 'monitor_name', nullable: false })
  public monitorName!: string

  /** Whether the task succeeded or not. */
  @Column({ type: 'boolean', nullable: false })
  public success = false
}
