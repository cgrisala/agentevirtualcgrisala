import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar')
  password!: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpiresAt?: Date | null;

  @Column({
    type: 'enum',
    enum: ['admin', 'staff', 'guest', 'manager'],
    default: 'guest'
  })
  role!: 'admin' | 'staff' | 'guest' | 'manager';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
