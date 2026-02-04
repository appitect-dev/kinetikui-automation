import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const REMOTION_ROOT = path.join(__dirname, "../../../remotion");
const OUTPUT_DIR = path.join(__dirname, "../../../videos");
const THUMBNAIL_DIR = path.join(__dirname, "../../../thumbnails");

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

export async function renderVideo(
  videoId: string,
  compositionId: string,
  props: any
): Promise<string> {
  try {
    // Update status
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "rendering" },
    });

    logger.info(`Starting render for video ${videoId}: ${compositionId}`);

    // Bundle Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(REMOTION_ROOT, "src/index.ts"),
      webpackOverride: (config) => config,
    });

    logger.info(`Bundled Remotion project: ${bundleLocation}`);

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    });

    logger.info(`Selected composition: ${composition.id}`);

    // Output path
    const outputPath = path.join(OUTPUT_DIR, `${videoId}.mp4`);

    // Render video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
      onProgress: ({ progress }) => {
        logger.info(`Render progress for ${videoId}: ${(progress * 100).toFixed(1)}%`);
      },
    });

    logger.info(`Video rendered successfully: ${outputPath}`);

    // Generate thumbnail (extract first frame)
    const thumbnailPath = path.join(THUMBNAIL_DIR, `${videoId}.jpg`);
    // You could use ffmpeg here to extract a frame, but for simplicity we'll skip it for now

    // Update database
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "rendered",
        filePath: outputPath,
        thumbnailPath: thumbnailPath,
      },
    });

    return outputPath;
  } catch (error: any) {
    logger.error(`Render failed for video ${videoId}:`, error);

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
