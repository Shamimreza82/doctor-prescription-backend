import { appConfig } from '@/config/app.config';
import { envConfig } from '@/config/env.config';

import { createApp } from './createApp';

import type { Server } from 'node:http';

const shutdown = async (server: Server, signal: string): Promise<void> => {
  console.info({ signal }, 'Received shutdown signal');

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
  console.info('Shutdown completed');
};

export const startServer = async (): Promise<Server> => {
  const app = createApp();

  // startTelemetry();
  // await getPrisma().$connect();

  const server = app.listen(appConfig.port, appConfig.host, () => {
    console.info({
        event: 'SERVER_START',
        host: appConfig.host,
        port: appConfig.port,
        environment: envConfig.nodeEnv,
        pid: process.pid,
        nodeVersion: process.version,
      },
      'Server started successfully',
    );
  });

  const handleSignal = (signal: 'SIGINT' | 'SIGTERM'): void => {
    void shutdown(server, signal)
      .catch((error: unknown) => {
        console.error({ err: error }, 'Shutdown failed');
      })
      .finally(() => {
        process.exit(0);
      });
  };

  process.on('SIGINT', () => {
    handleSignal('SIGINT');
  });

  process.on('SIGTERM', () => {
    handleSignal('SIGTERM');
  });

  // TODO: add handlers for uncaught exceptions and unhandled promise rejections
  process.on('uncaughtException', (error) => {
    console.error({ err: error }, 'Uncaught exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error({ err: reason }, 'Unhandled rejection');
    process.exit(1);
  });

  return server;
};
