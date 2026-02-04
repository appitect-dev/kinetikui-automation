import express from "express";
import { PrismaClient } from "@prisma/client";
import { initializeScheduler } from "./instagram/scheduler";
import { initializeWorkers, addVideoToQueue, getQueueStats } from "./render/queue";
import { logger } from "./utils/logger";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve rendered videos publicly (for Instagram upload)
app.use("/videos", express.static(path.join(__dirname, "../../videos")));
app.use("/thumbnails", express.static(path.join(__dirname, "../../thumbnails")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Queue stats
app.get("/api/queue/stats", async (req, res) => {
  try {
    const stats = await getQueueStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create and queue a video
app.post("/api/videos", async (req, res) => {
  try {
    const { compositionId, title, caption, hashtags, props } = req.body;

    const video = await prisma.video.create({
      data: {
        compositionId,
        title,
        caption,
        hashtags,
        props: JSON.stringify(props || {}),
        status: "pending",
      },
    });

    await addVideoToQueue(video.id, compositionId, props || {});

    res.json(video);
  } catch (error: any) {
    logger.error("Failed to create video:", error);
    res.status(500).json({ error: error.message });
  }
});

// List videos
app.get("/api/videos", async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    const videos = await prisma.video.findMany({
      where: status ? { status: status as string } : undefined,
      orderBy: { createdAt: "desc" },
      take: Number(limit),
    });

    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get video by ID
app.get("/api/videos/:id", async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
app.post("/api/settings", async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: req.body,
      create: { id: "default", ...req.body },
    });

    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get settings
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: "default" },
      });
    }

    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function start() {
  try {
    // Initialize render workers
    const concurrency = Number(process.env.RENDER_CONCURRENCY) || 3;
    initializeWorkers(concurrency);

    // Initialize Instagram scheduler
    initializeScheduler();

    app.listen(Number(PORT), '0.0.0.0', () => {
      logger.info(`Backend server running on http://0.0.0.0:${PORT}`);
      logger.info(`Videos endpoint: http://0.0.0.0:${PORT}/videos`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
