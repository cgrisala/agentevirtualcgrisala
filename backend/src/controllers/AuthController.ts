import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
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
      const user = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      });

      await userRepository.save(user);

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      const response: ApiResponse<{ user: Partial<User>, token: string }> = {
        success: true,
        data: {
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
          token
        },
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Registration failed',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date().toISOString()
        };
        res.status(401).json(response);
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      const response: ApiResponse<{ user: Partial<User>, token: string }> = {
        success: true,
        data: {
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
          token
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error) {
      logger.error('Login error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Login failed',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async refresh(_req: Request, res: Response): Promise<void> {
    // Implement refresh token logic if needed
    res.json({ success: true, message: 'Refresh token' });
  }
}