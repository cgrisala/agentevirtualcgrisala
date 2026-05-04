import { DataSource } from 'typeorm';
import { User } from '../models/User.js';
import { Reservation } from '../models/Reservation.js';
import { Guest } from '../models/Guest.js';
import { Room } from '../models/Room.js';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'sqlite',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_TYPE === 'postgres' ? (process.env.DB_NAME || 'cgrisala_db') : (process.env.DB_NAME || 'database.sqlite'),
  synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Reservation, Guest, Room],
  subscribers: [],
  migrations: [],
});
