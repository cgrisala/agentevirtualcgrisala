import { AppDataSource } from '../config/database';
import { logger } from '../utils/logger';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Run migrations if any (TypeORM handles sync in dev)
    if (process.env.NODE_ENV === 'production') {
      await AppDataSource.runMigrations();
      logger.info('Migrations executed successfully');
    } else {
      // In development, synchronize schema
      await AppDataSource.synchronize();
      logger.info('Schema synchronized successfully');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();