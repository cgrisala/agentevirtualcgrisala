import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Room } from '../models/Room';
import { ApiResponse, PaginatedResponse } from '../types';

const roomRepository = AppDataSource.getRepository(Room);

export class RoomController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const [rooms, total] = await roomRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' }
      });

      const response: ApiResponse<PaginatedResponse<Room>> = {
        success: true,
        data: {
          items: rooms,
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
        error: 'Failed to fetch rooms',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const room = roomRepository.create(req.body);
      await roomRepository.save(room);

      const response: ApiResponse<Room> = {
        success: true,
        data: room,
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create room',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const room = await roomRepository.findOneBy({ id: req.params.id });
      if (!room) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Room not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Room> = {
        success: true,
        data: room,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch room',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const room = await roomRepository.findOneBy({ id: req.params.id });
      if (!room) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Room not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      roomRepository.merge(room, req.body);
      await roomRepository.save(room);

      const response: ApiResponse<Room> = {
        success: true,
        data: room,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update room',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await roomRepository.delete(req.params.id);
      if (result.affected === 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Room not found',
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
        error: 'Failed to delete room',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}