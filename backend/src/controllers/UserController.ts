import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database.js';
import { User } from '../models/User.js';
import { ApiResponse, PaginatedResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const [users, total] = await userRepository.findAndCount({
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' }
      });

      const response: ApiResponse<PaginatedResponse<User>> = {
        success: true,
        data: {
          items: users,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch users:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch users',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userRepository.findOne({
        where: { id: req.params.id },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt']
      });

      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch user:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch user',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role = 'guest' } = req.body;

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User already exists',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({ email, password: hashedPassword, firstName, lastName, role });
      await userRepository.save(user);

      const response: ApiResponse<User> = {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          password: '' as any
        },
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create user:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create user',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await userRepository.findOne({ where: { id: req.params.id } });
      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      userRepository.merge(user, req.body);
      await userRepository.save(user);

      const response: ApiResponse<User> = {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          password: '' as any
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Failed to update user:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update user',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await userRepository.delete(req.params.id);
      if (result.affected === 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      res.status(204).json();
    } catch (error) {
      logger.error('Failed to delete user:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete user',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}
