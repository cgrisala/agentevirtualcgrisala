import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guest } from './Guest';
import { Room } from './Room';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  guestId!: string;

  @ManyToOne(() => Guest)
  @JoinColumn({ name: 'guestId' })
  guest!: Guest;

  @Column('uuid')
  roomId!: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({ type: 'date' })
  checkInDate!: Date;

  @Column({ type: 'date' })
  checkOutDate!: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  })
  status!: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}