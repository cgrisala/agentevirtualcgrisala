import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  roomNumber!: string;

  @Column('int')
  capacity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight!: number;

  @Column({
    type: 'enum',
    enum: ['single', 'double', 'suite']
  })
  type!: 'single' | 'double' | 'suite';

  @Column('simple-array')
  amenities!: string[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}