import { Queue, Worker, Job } from "bullmq";
import { renderVideo } from "./worker";
import { logger } from "../utils/logger";
import Redis from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

export const videoQueue = new Queue("video-rendering", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
    removeOnComplete: {
      count: 100,
    },
    removeOnFail: {
      count: 200,
    },
  },
});

/**
 * Add a video to the render queue
 */
export async function addVideoToQueue(
  videoId: string,
  compositionId: string,
  props: any
): Promise<string> {
  const job = await videoQueue.add(
    "render",
    {
      videoId,
      compositionId,
      props,
    },
    {
      jobId: videoId,
    }
  );

  logger.info(`Added video ${videoId} to render queue (job: ${job.id})`);
  return job.id!;
}

/**
 * Initialize render workers
 */
export function initializeWorkers(concurrency: number = 3): void {
  const worker = new Worker(
    "video-rendering",
    async (job: Job) => {
      logger.info(`Processing render job ${job.id}: ${job.data.compositionId}`);
      return await renderVideo(job.data.videoId, job.data.compositionId, job.data.props);
    },
    {
      connection,
      concurrency, // Process 3 videos at once
    }
  );

  worker.on("completed", (job: Job) => {
    logger.info(`Render job ${job.id} completed successfully`);
  });

  worker.on("failed", (job: Job | undefined, err: Error) => {
    logger.error(`Render job ${job?.id} failed:`, err);
  });

  worker.on("progress", (job: Job, progress: number | object) => {
    logger.info(`Render job ${job.id} progress: ${JSON.stringify(progress)}`);
  });

  logger.info(`Render workers initialized with concurrency: ${concurrency}`);
}

/**
 * Get queue stats
 */
export async function getQueueStats() {
  const [waiting, active, completed, failed] = await Promise.all([
    videoQueue.getWaitingCount(),
    videoQueue.getActiveCount(),
    videoQueue.getCompletedCount(),
    videoQueue.getFailedCount(),
  ]);

  return { waiting, active, completed, failed };
}
