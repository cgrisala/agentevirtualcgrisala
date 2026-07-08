import axios from 'axios';
import { logger } from '../utils/logger.js';

/**
 * URL del webhook en la instancia PÚBLICA de n8n.
 * Debería estar en una variable de entorno.
 */
const N8N_PUBLIC_WEBHOOK_URL = process.env.N8N_PUBLIC_WEBHOOK_URL;

if (!N8N_PUBLIC_WEBHOOK_URL) {
  logger.warn('La variable de entorno N8N_PUBLIC_WEBHOOK_URL no está definida. La integración con n8n no funcionará.');
}

/**
 * Datos que se envían al workflow de n8n.
 */
export interface N8nWebhookPayload {
  eventName: string;
  payload: Record<string, unknown>;
}

export class N8nService {
  /**
   * Dispara un workflow en el n8n público.
   * @param eventName - Nombre del evento para identificar el workflow (ej. 'chatMessageReceived').
   * @param payload - Los datos a enviar.
   */
  static async triggerWorkflow(eventName: string, payload: Record<string, unknown>): Promise<void> {
    if (!N8N_PUBLIC_WEBHOOK_URL) {
      logger.error('No se puede disparar el workflow porque N8N_PUBLIC_WEBHOOK_URL no está configurada.');
      // En un entorno real, podríamos querer lanzar un error o manejarlo de otra forma.
      return;
    }

    const webhookPayload: N8nWebhookPayload = { eventName, payload };

    logger.info(`Disparando workflow de n8n '${eventName}'...`);
    // No esperamos la respuesta para no bloquear el hilo principal (fire-and-forget)
    axios.post(N8N_PUBLIC_WEBHOOK_URL, webhookPayload).catch(error => {
      logger.error('Error al disparar el workflow de n8n:', { error: error.message, payload });
    });
  }
}