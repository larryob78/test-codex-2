import 'dotenv/config';
import { Worker } from 'bullmq';
import pino from 'pino';
import fetch from 'node-fetch';
import { createRegistry } from '@weaverboard/nodes';
import type { NodeManifest } from '@weaverboard/nodes';

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });

const connection = {
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379)
  }
};


const registry = createRegistry();

new Worker(
  'runs',
  async (job) => {
    logger.info({ jobId: job.id, name: job.name }, 'processing run job');
    const nodeId: string = job.data.nodeId;
    const manifest = registry[nodeId] as NodeManifest | undefined;
    if (!manifest) {
      throw new Error(`Unknown node ${nodeId}`);
    }
    await fetch(`${process.env.API_URL ?? 'http://api:3001'}/internal/runs/${job.data.runId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    return { success: true };
  },
  connection
).on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'run job failed');
});

logger.info('Worker ready');
