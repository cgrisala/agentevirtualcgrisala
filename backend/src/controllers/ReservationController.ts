import { Request, Response } from 'express';
import { AppDataSource } from '../config/database.js';
import { Reservation } from '../models/Reservation.js';
import { ApiResponse, PaginatedResponse } from '../types/index.js';

const reservationRepository = AppDataSource.getRepository(Reservation);

export class ReservationController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const [reservations, total] = await reservationRepository.findAndCount({
        relations: ['guest', 'room'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' }
      });

      const response: ApiResponse<PaginatedResponse<Reservation>> = {
        success: true,
        data: {
          items: reservations,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch reservations',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const reservation = reservationRepository.create(req.body as Partial<Reservation>);
      await reservationRepository.save(reservation);

      const response: ApiResponse<Reservation> = {
        success: true,
        data: reservation,
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create reservation',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const reservation = await reservationRepository.findOne({
        where: { id: req.params.id },
        relations: ['guest', 'room']
      });

      if (!reservation) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Reservation not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Reservation> = {
        success: true,
        data: reservation,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch reservation',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const reservation = await reservationRepository.findOneBy({ id: req.params.id });
      if (!reservation) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Reservation not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      reservationRepository.merge(reservation, req.body);
      await reservationRepository.save(reservation);

      const response: ApiResponse<Reservation> = {
        success: true,
        data: reservation,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update reservation',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await reservationRepository.delete(req.params.id);
      if (result.affected === 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Reservation not found',
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
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete reservation',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getTimeline(_req: Request, res: Response): Promise<void> {
    // Implement timeline logic
    res.json({ success: true, message: 'Timeline' });
  }
}
