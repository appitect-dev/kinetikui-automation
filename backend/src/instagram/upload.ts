import { PrismaClient } from "@prisma/client";
import { InstagramAPI } from "./api";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function uploadVideoToInstagram(videoId: string): Promise<void> {
  const video = await prisma.video.findUnique({ where: { id: videoId } });

  if (!video) {
    throw new Error(`Video not found: ${videoId}`);
  }

  if (video.status !== "scheduled") {
    throw new Error(`Video not ready for upload: ${video.status}`);
  }

  if (!video.filePath || !fs.existsSync(video.filePath)) {
    throw new Error(`Video file not found: ${video.filePath}`);
  }

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });

  if (!settings?.instagramAccessToken || !settings?.instagramAccountId) {
    throw new Error("Instagram credentials not configured");
  }

  const instagram = new InstagramAPI(settings.instagramAccessToken, settings.instagramAccountId);

  try {
    // Update status
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "posting" },
    });

    // In production, you'd upload the file to a public URL first (S3, etc.)
    // For VPS deployment, we'll use a public endpoint from the Express server
    const publicVideoUrl = process.env.PUBLIC_VIDEO_URL || `http://46.62.209.17:3000/videos/${path.basename(video.filePath)}`;

    // Build caption with hashtags
    const caption = [video.caption, video.hashtags].filter(Boolean).join("\n\n");

    // Upload to Instagram
    logger.info(`Uploading video to Instagram: ${video.title}`);
    const instagramId = await instagram.uploadVideo(publicVideoUrl, caption);

    // Update database
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "posted",
        instagramId,
        postedAt: new Date(),
      },
    });

    logger.info(`Video successfully posted to Instagram: ${instagramId}`);
  } catch (error: any) {
    logger.error(`Failed to upload video ${videoId}:`, error);

    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "failed",
        error: error.message,
      },
    });

    throw error;
  }
}

export async function retryFailedUploads(): Promise<void> {
  const failedVideos = await prisma.video.findMany({
    where: { status: "failed" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  logger.info(`Found ${failedVideos.length} failed uploads to retry`);

  for (const video of failedVideos) {
    try {
      await prisma.video.update({
        where: { id: video.id },
        data: { status: "scheduled" },
      });

      await uploadVideoToInstagram(video.id);
    } catch (error) {
      logger.error(`Retry failed for video ${video.id}`);
    }
  }
}
