import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

const host = process.env.MAIL_HOST;
const port = parseInt(process.env.MAIL_PORT || '587', 10);
const secure = process.env.MAIL_SECURE === 'true';
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;
const fromAddress = process.env.MAIL_FROM || 'no-reply@cgrisala.com';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const transporter = host && user && pass
  ? nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })
  : null;

export const isEmailConfigured = (): boolean => Boolean(transporter);

export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
  if (!transporter) {
    logger.warn('Email configuration is incomplete. Skipping password reset email.');
    return;
  }

  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = 'Recuperación de contraseña - Agente Virtual CGrisala';
  const text = `Hola,

Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:

${resetUrl}

Si no solicitaste este cambio, ignora este mensaje.
`;
  const html = `
    <p>Hola,</p>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">Haz clic aquí para restablecer tu contraseña</a></p>
    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
  `;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Password reset email sent to ${to}`);
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
  }
};
