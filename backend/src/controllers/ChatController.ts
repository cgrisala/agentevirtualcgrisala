import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { N8nJobQueue } from '../models/N8nJobQueue.js';

export class ChatController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, sender } = req.body;

      // Creamos una nueva tarea para ser procesada por n8n
      const job = N8nJobQueue.create({
        eventName: 'chatMessageReceived',
        payload: {
          message,
          phoneNumber: sender, // Asumiendo que 'sender' es el número de teléfono
        },
      });
      await job.save();

      logger.info(`Nuevo trabajo [${job.eventName}] encolado con ID: ${job.id}`);

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Mensaje recibido y siendo procesado.' },
        timestamp: new Date().toISOString(),
      };

      // Respondemos inmediatamente para no dejar al cliente esperando.
      res.status(202).json(response); // 202 Accepted es ideal para fire-and-forget
    } catch (error) {
      logger.error('Error encolando el trabajo del chat:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Hubo un error al procesar la solicitud de mensaje.',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }
}
