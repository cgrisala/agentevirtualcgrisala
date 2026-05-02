import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar')
  phone!: string;

  @Column('varchar', { nullable: true })
  whatsappPhone?: string;

  @Column('varchar', { nullable: true })
  nationality?: string;

  @Column('varchar', { nullable: true })
  documentType?: string;

  @Column('varchar', { nullable: true })
  documentNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
