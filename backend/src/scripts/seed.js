import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Room } from '../models/Room';
import { Guest } from '../models/Guest';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected for seeding');

    const userRepository = AppDataSource.getRepository(User);
    const roomRepository = AppDataSource.getRepository(Room);
    const guestRepository = AppDataSource.getRepository(Guest);

    // Seed admin user
    const adminExists = await userRepository.findOne({ where: { email: 'admin@cgrisala.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        email: 'admin@cgrisala.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'CGrisala',
        role: 'admin'
      });
      await userRepository.save(admin);
      logger.info('Admin user created');
    }

    // Seed sample rooms
    const roomCount = await roomRepository.count();
    if (roomCount === 0) {
      const rooms = [
        { name: 'Habitación Deluxe', roomNumber: '101', capacity: 2, pricePerNight: 150.00, type: 'double', amenities: ['WiFi', 'TV', 'Aire acondicionado'] },
        { name: 'Suite Ejecutiva', roomNumber: '201', capacity: 4, pricePerNight: 300.00, type: 'suite', amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar'] },
        { name: 'Habitación Estándar', roomNumber: '102', capacity: 1, pricePerNight: 80.00, type: 'single', amenities: ['WiFi', 'TV'] }
      ];

      for (const roomData of rooms) {
        const room = roomRepository.create(roomData);
        await roomRepository.save(room);
      }
      logger.info('Sample rooms created');
    }

    // Seed sample guest
    const guestCount = await guestRepository.count();
    if (guestCount === 0) {
      const guest = guestRepository.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+1234567890',
        whatsappPhone: '+1234567890',
        nationality: 'Mexicano',
        documentType: 'INE',
        documentNumber: '123456789'
      });
      await guestRepository.save(guest);
      logger.info('Sample guest created');
    }

    logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();