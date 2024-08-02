import type { Application } from 'express';
import helmet from 'helmet';

export function useSecurityMiddleware(app: Application): void {
  // Remove fingerprinting
  app.disable('x-powered-by');

  // Default secure response header. For details, see https://helmetjs.github.io/
  app.use(helmet());

  // App behind a reverse proxy
  app.set('trust proxy', 'loopback');
}
