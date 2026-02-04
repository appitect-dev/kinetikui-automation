import { Router } from "express";
import { SubtitleService } from "./service";
import { logger } from "../utils/logger";
import fs from "fs/promises";
import path from "path";

const router = Router();

/**
 * POST /api/subtitles/generate
 * Generate subtitle chunks from script
 */
router.post("/generate", async (req, res) => {
  try {
    const { script, fps = 30, durationInFrames, maxWordsPerChunk = 3, wordsPerSecond = 2.5 } = req.body;

    if (!script || !durationInFrames) {
      return res.status(400).json({
        error: "Missing required fields: script, durationInFrames",
      });
    }

    const chunks = SubtitleService.generateChunks(script, {
      fps,
      durationInFrames,
      maxWordsPerChunk,
      wordsPerSecond,
    });

    res.json({
      success: true,
      chunks,
      metadata: {
        totalChunks: chunks.length,
        totalWords: chunks.reduce((sum, c) => sum + c.words.length, 0),
        fps,
        durationInFrames,
      },
    });
  } catch (error: any) {
    logger.error("Failed to generate subtitles:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/subtitles/export
 * Export subtitles as SRT or VTT file
 */
router.post("/export", async (req, res) => {
  try {
    const { chunks, fps = 30, format = "srt", videoId } = req.body;

    if (!chunks || !Array.isArray(chunks)) {
      return res.status(400).json({ error: "Invalid chunks data" });
    }

    let content: string;
    let filename: string;

    if (format === "vtt") {
      content = SubtitleService.generateVTT(chunks, fps);
      filename = `subtitles_${videoId || Date.now()}.vtt`;
    } else {
      content = SubtitleService.generateSRT(chunks, fps);
      filename = `subtitles_${videoId || Date.now()}.srt`;
    }

    // Save to subtitles directory
    const subtitlesDir = path.join(__dirname, "../../../subtitles");
    await fs.mkdir(subtitlesDir, { recursive: true });

    const filePath = path.join(subtitlesDir, filename);
    await fs.writeFile(filePath, content, "utf-8");

    logger.info(`Subtitle file saved: ${filePath}`);

    res.json({
      success: true,
      filename,
      path: `/subtitles/${filename}`,
      content,
    });
  } catch (error: any) {
    logger.error("Failed to export subtitles:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/subtitles/:filename
 * Download subtitle file
 */
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../../subtitles", filename);

    const content = await fs.readFile(filePath, "utf-8");
    const ext = path.extname(filename).toLowerCase();

    res.setHeader(
      "Content-Type",
      ext === ".vtt" ? "text/vtt" : "text/plain"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(content);
  } catch (error: any) {
    logger.error("Failed to retrieve subtitle file:", error);
    res.status(404).json({ error: "Subtitle file not found" });
  }
});

export default router;
