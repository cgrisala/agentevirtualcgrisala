# Architectural Decision Records (ADR)

## 1. Lenguaje de Programación

**Decisión:** TypeScript para backend y frontend.

**Justificación:**
- TypeScript proporciona tipado estático, reduciendo errores en tiempo de ejecución.
- Mejor mantenibilidad y escalabilidad para un proyecto de gestión hotelera.
- Amplio soporte en la comunidad para frameworks como Express y React.

**Alternativas consideradas:** JavaScript puro.
- Razón de rechazo: Mayor riesgo de bugs y dificultad en refactorización.

## 2. Frameworks

**Backend:**
- **Express.js:** Framework minimalista para APIs REST, fácil de usar con middleware.
- **TypeORM:** ORM para TypeScript, soporta PostgreSQL y facilita migraciones.

**Frontend:**
- **React:** Biblioteca para UI, con hooks y componentes reutilizables.
- **Vite:** Herramienta de build rápida para desarrollo.

**Justificación:** Stack moderno, productivo y escalable. Express es ligero, React es flexible.

**Alternativas:** NestJS para backend (más pesado), Vue.js para frontend (menos adoptado).

## 3. Arquitectura

**Cliente-Servidor con API REST.**

**Justificación:**
- Separación clara entre frontend (React) y backend (Express).
- API REST permite integración con n8n y WhatsApp.
- Fácil testing y mantenimiento.

**Patrón MVC implementado:**
- Modelos: TypeORM entities.
- Vistas: JSON responses (API).
- Controladores: Lógica HTTP separada.

## 4. Base de Datos

**PostgreSQL.**

**Justificación:**
- Relacional, adecuado para reservas y huéspedes.
- Soporte JSON para flexibilidad.
- TypeORM facilita queries.

**Alternativas:** MongoDB (NoSQL, menos estructurado para este caso).

## 5. Herramientas Adicionales

- **ESLint + Prettier:** Calidad de código.
- **Vitest:** Testing rápido.
- **Winston:** Logging.
- **Joi:** Validación.
- **JWT:** Autenticación segura.
- **Tailwind CSS:** Estilos rápidos y consistentes.

**Justificación:** Herramientas estándar en la industria para productividad y calidad.

## 6. Integraciones Externas

- **n8n:** Para workflows automatizados (reservas vía WhatsApp).
- **Evolution API:** Para WhatsApp business.

**Justificación:** Permite automatización sin código, ideal para un agente virtual.

## Enlace Figma
Interfaz diseñada en: https://www.figma.com/design/example-link (placeholder - reemplazar con enlace real)