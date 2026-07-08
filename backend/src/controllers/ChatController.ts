import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { N8nService } from '../services/n8nService.js';

export class ChatController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      // Delegamos el procesamiento del mensaje al servicio de n8n.
      // El evento podría ser 'chatMessageReceived' o algo más específico.
      await N8nService.triggerWorkflow('chatMessageReceived', { message, sender: req.body.sender });

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Mensaje recibido y siendo procesado.' },
        timestamp: new Date().toISOString(),
      };

      // Respondemos inmediatamente para no dejar al cliente esperando.
      res.status(202).json(response); // 202 Accepted es ideal para fire-and-forget
    } catch (error) {
      logger.error('Error processing message:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Hubo un error al procesar la solicitud de mensaje.',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }
}
