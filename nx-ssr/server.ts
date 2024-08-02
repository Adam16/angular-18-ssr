import type http from 'http';
import type { Application } from 'express';
// angular universal parts
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
// http server parts
import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import { rateLimit } from 'express-rate-limit';
// core node
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
// our ssr universal app
import bootstrap from './src/main.server';
// our middleware
import {
  errorClientMiddleware,
  errorLoggerMiddleware,
  useSecurityMiddleware,
} from './src/middleware';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): Application {
  const ssrApp = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  const commonEngine = new CommonEngine();

  // App behind a reverse proxy
  useSecurityMiddleware(ssrApp);

  // Enable gzip
  ssrApp.use(compression());

  // Favicon fallback
  ssrApp.use(favicon(browserDistFolder + '/favicon.ico'));

  // Template engine
  ssrApp.set('view engine', 'html');
  ssrApp.set('views', browserDistFolder);

  // Serve static files from /browser
  ssrApp.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  ssrApp.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  // Global error handling
  ssrApp.use(limiter, errorLoggerMiddleware);
  ssrApp.use(limiter, errorClientMiddleware);

  return ssrApp;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`App server listening on http://localhost:${port}`);
  });

  // SIGTERM signal
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    // Express close type does not seem to be available (type-coverage issue?)
    (server as unknown as http.Server).close(() => {
      console.log('App server closed');
    });
  });
}

run();
