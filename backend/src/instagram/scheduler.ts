import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { uploadVideoToInstagram } from "./upload";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

/**
 * Check for videos scheduled for posting and post them
 */
async function checkScheduledPosts(): Promise<void> {
  const now = new Date();
  const videos = await prisma.video.findMany({
    where: {
      status: "scheduled",
      scheduledFor: {
        lte: now,
      },
    },
    orderBy: { scheduledFor: "asc" },
    take: 1, // Post one at a time
  });

  if (videos.length === 0) {
    logger.info("No scheduled posts ready");
    return;
  }

  for (const video of videos) {
    try {
      logger.info(`Posting scheduled video: ${video.title}`);
      await uploadVideoToInstagram(video.id);
    } catch (error) {
      logger.error(`Failed to post scheduled video ${video.id}:`, error);
    }
  }
}

/**
 * Schedule next batch of videos
 */
async function scheduleNextBatch(): Promise<void> {
  const settings = await prisma.settings.findUnique({ where: { id: "default" } });

  if (!settings?.enabled) {
    logger.info("Scheduling disabled");
    return;
  }

  const postingTimes = settings.postingTimes.split(","); // e.g., "09:00,14:00,19:00"

  // Get unscheduled videos
  const videos = await prisma.video.findMany({
    where: {
      status: "rendered",
      scheduledFor: null,
    },
    orderBy: { createdAt: "asc" },
    take: 30, // Schedule up to 30 videos (10 days worth)
  });

  if (videos.length === 0) {
    logger.info("No videos to schedule");
    return;
  }

  const now = new Date();
  let scheduleIndex = 0;
  let currentDate = new Date(now);

  for (const video of videos) {
    const [hours, minutes] = postingTimes[scheduleIndex].split(":").map(Number);

    currentDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, move to tomorrow
    if (currentDate <= now) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    await prisma.video.update({
      where: { id: video.id },
      data: {
        scheduledFor: new Date(currentDate),
        status: "scheduled",
      },
    });

    logger.info(`Scheduled "${video.title}" for ${currentDate.toISOString()}`);

    // Move to next time slot
    scheduleIndex = (scheduleIndex + 1) % postingTimes.length;
    if (scheduleIndex === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
}

/**
 * Initialize cron jobs
 */
export function initializeScheduler(): void {
  // Check for posts to publish every minute
  cron.schedule("* * * * *", async () => {
    try {
      await checkScheduledPosts();
    } catch (error) {
      logger.error("Scheduler error:", error);
    }
  });

  // Auto-schedule new videos every hour
  cron.schedule("0 * * * *", async () => {
    try {
      await scheduleNextBatch();
    } catch (error) {
      logger.error("Auto-schedule error:", error);
    }
  });

  logger.info("Scheduler initialized");
}
