import express from "express";
import { PrismaClient } from "@prisma/client";
import { initializeScheduler } from "./instagram/scheduler";
import { initializeWorkers, addVideoToQueue, getQueueStats } from "./render/queue";
import { VoiceService } from "./render/voice";
import { logger } from "./utils/logger";
import dotenv from "dotenv";
import path from "path";
import subtitleRoutes from "./subtitles/routes";
import marketingRoutes from "./marketing/routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const voiceService = new VoiceService();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS - Allow requests from Vercel dashboard
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve rendered videos publicly (for Instagram upload)
app.use("/videos", express.static(path.join(__dirname, "../../videos")));
app.use("/thumbnails", express.static(path.join(__dirname, "../../thumbnails")));
app.use("/subtitles", express.static(path.join(__dirname, "../../subtitles")));

// API routes
app.use("/api/subtitles", subtitleRoutes);
app.use("/api/marketing", marketingRoutes);

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

// Update video by ID
app.patch("/api/videos/:id", async (req, res) => {
  try {
    const video = await prisma.video.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(video);
  } catch (error: any) {
    logger.error("Failed to update video:", error);
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

// ============================================
// Voice API Endpoints
// ============================================

// Get available voice presets
app.get("/api/voice/presets", (req, res) => {
  try {
    const presets = voiceService.getPresets();
    res.json(presets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate voiceover audio from script
app.post("/api/voice/generate", async (req, res) => {
  try {
    const { text, voicePresetId, speakingRate, pitch, stability, similarityBoost } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!voicePresetId) {
      return res.status(400).json({ error: "Voice preset ID is required" });
    }

    const result = await voiceService.generate({
      text,
      voicePresetId,
      speakingRate,
      pitch,
      stability,
      similarityBoost,
    });

    // Return relative path for frontend
    const relativePath = path.relative(
      path.join(__dirname, "../../"),
      result.audioPath
    );

    res.json({
      ...result,
      audioUrl: `/audio/${path.basename(result.audioPath)}`,
      relativePath,
    });
  } catch (error: any) {
    logger.error("Voice generation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Auto-generate script from template props
app.post("/api/voice/generate-script", (req, res) => {
  try {
    const { compositionId, props } = req.body;

    if (!compositionId || !props) {
      return res.status(400).json({ error: "compositionId and props are required" });
    }

    const script = voiceService.generateScript(compositionId, props);
    res.json({ script });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve audio files
app.use("/audio", express.static(path.join(__dirname, "../../audio")));

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
