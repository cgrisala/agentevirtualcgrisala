import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class ChatController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      // Aquí se integraría con n8n para enviar el mensaje
      // Por ahora, simulamos una respuesta automática
      let responseMessage = '';

      if (message.toLowerCase().includes('reserva') || message.toLowerCase().includes('habitación')) {
        responseMessage = 'Para hacer una reserva, necesito saber: ¿Qué fechas te interesan? ¿Cuántas personas? ¿Qué tipo de habitación prefieres?';
      } else if (message.toLowerCase().includes('precio') || message.toLowerCase().includes('costo')) {
        responseMessage = 'Nuestras habitaciones van desde $50.000 por noche para individuales hasta $150.000 para suites. ¿Te gustaría más detalles?';
      } else if (message.toLowerCase().includes('horario') || message.toLowerCase().includes('hora')) {
        responseMessage = 'El hotel está abierto 24 horas. Recepción disponible de 6:00 AM a 11:00 PM.';
      } else {
        responseMessage = 'Gracias por tu mensaje. Un agente de recepción se pondrá en contacto contigo pronto. También puedes llamarnos al +57 123 456 7890.';
      }

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: responseMessage },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Error processing message:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al procesar el mensaje',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }
}
