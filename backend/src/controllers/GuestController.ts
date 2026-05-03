import { Request, Response } from 'express';
import { AppDataSource } from '../config/database.js';
import { Guest } from '../models/Guest.js';
import { ApiResponse, PaginatedResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';

const guestRepository = AppDataSource.getRepository(Guest);

export class GuestController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const [guests, total] = await guestRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' }
      });

      const response: ApiResponse<PaginatedResponse<Guest>> = {
        success: true,
        data: {
          items: guests,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch guests:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch guests',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const guest = guestRepository.create(req.body as Partial<Guest>);
      await guestRepository.save(guest);

      const response: ApiResponse<Guest> = {
        success: true,
        data: guest,
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create guest:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create guest',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const guest = await guestRepository.findOneBy({ id: req.params.id });
      if (!guest) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Guest not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Guest> = {
        success: true,
        data: guest,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch guest:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch guest',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const guest = await guestRepository.findOneBy({ id: req.params.id });
      if (!guest) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Guest not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      guestRepository.merge(guest, req.body);
      await guestRepository.save(guest);

      const response: ApiResponse<Guest> = {
        success: true,
        data: guest,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to update guest:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update guest',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await guestRepository.delete(req.params.id);
      if (result.affected === 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Guest not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        timestamp: new Date().toISOString()
      };
      res.status(204).json(response);
    } catch (error) {
      logger.error('Failed to delete guest:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete guest',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}
