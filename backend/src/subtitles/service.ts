import { logger } from "../utils/logger";

export interface SubtitleWord {
  word: string;
  start: number; // Frame number
  end: number;
}

export interface SubtitleChunk {
  words: SubtitleWord[];
  start: number;
  end: number;
}

export interface SubtitleConfig {
  fps: number;
  durationInFrames: number;
  maxWordsPerChunk?: number;
  wordsPerSecond?: number; // Average speaking rate
}

export class SubtitleService {
  /**
   * Generate subtitle chunks from a script with word-level timing
   */
  static generateChunks(
    script: string,
    config: SubtitleConfig
  ): SubtitleChunk[] {
    const {
      fps,
      durationInFrames,
      maxWordsPerChunk = 3,
      wordsPerSecond = 2.5, // Natural speaking pace
    } = config;

    // Clean and tokenize script
    const words = this.tokenize(script);

    if (words.length === 0) {
      logger.warn("Empty script provided for subtitle generation");
      return [];
    }

    // Calculate timing based on natural speech rate
    const totalWords = words.length;
    const estimatedDurationSeconds = totalWords / wordsPerSecond;
    const availableDurationSeconds = durationInFrames / fps;

    // Adjust if needed
    const actualWordsPerSecond =
      estimatedDurationSeconds > availableDurationSeconds
        ? totalWords / availableDurationSeconds
        : wordsPerSecond;

    const framesPerWord = Math.floor((fps / actualWordsPerSecond));

    logger.info(
      `Generating subtitles: ${totalWords} words, ${framesPerWord} frames/word, ${actualWordsPerSecond.toFixed(2)} words/sec`
    );

    // Generate word-level timing
    const timedWords: SubtitleWord[] = [];
    let currentFrame = 0;

    words.forEach((word) => {
      // Adjust timing based on word length (longer words get more time)
      const wordDuration = this.calculateWordDuration(word, framesPerWord);

      timedWords.push({
        word,
        start: currentFrame,
        end: Math.min(currentFrame + wordDuration - 1, durationInFrames - 1),
      });

      currentFrame += wordDuration;
    });

    // Group words into chunks
    const chunks = this.createChunks(timedWords, maxWordsPerChunk);

    logger.info(`Generated ${chunks.length} subtitle chunks`);

    return chunks;
  }

  /**
   * Tokenize script into words, preserving emojis
   */
  private static tokenize(script: string): string[] {
    // Clean script
    let cleaned = script
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Split by whitespace but keep emojis attached
    const words = cleaned.split(/\s+/).filter((w) => w.length > 0);

    return words;
  }

  /**
   * Calculate duration for a word based on its length
   */
  private static calculateWordDuration(
    word: string,
    baseFrames: number
  ): number {
    // Remove emojis for length calculation
    const textOnly = word.replace(/[\u{1F600}-\u{1F64F}]/gu, "");
    const length = textOnly.length;

    // Adjust: longer words get more time
    if (length <= 3) return baseFrames;
    if (length <= 6) return Math.floor(baseFrames * 1.2);
    if (length <= 9) return Math.floor(baseFrames * 1.4);
    return Math.floor(baseFrames * 1.6);
  }

  /**
   * Group timed words into display chunks
   */
  private static createChunks(
    words: SubtitleWord[],
    maxWordsPerChunk: number
  ): SubtitleChunk[] {
    const chunks: SubtitleChunk[] = [];

    for (let i = 0; i < words.length; i += maxWordsPerChunk) {
      const chunkWords = words.slice(i, i + maxWordsPerChunk);

      chunks.push({
        words: chunkWords,
        start: chunkWords[0].start,
        end: chunkWords[chunkWords.length - 1].end,
      });
    }

    return chunks;
  }

  /**
   * Generate SRT file content
   */
  static generateSRT(chunks: SubtitleChunk[], fps: number): string {
    let srt = "";

    chunks.forEach((chunk, index) => {
      const startTime = this.framesToSRT(chunk.start, fps);
      const endTime = this.framesToSRT(chunk.end, fps);
      const text = chunk.words.map((w) => w.word).join(" ");

      srt += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
    });

    return srt;
  }

  /**
   * Generate VTT file content
   */
  static generateVTT(chunks: SubtitleChunk[], fps: number): string {
    let vtt = "WEBVTT\n\n";

    chunks.forEach((chunk, index) => {
      const startTime = this.framesToVTT(chunk.start, fps);
      const endTime = this.framesToVTT(chunk.end, fps);
      const text = chunk.words.map((w) => w.word).join(" ");

      vtt += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
    });

    return vtt;
  }

  /**
   * Convert frame to SRT timestamp (HH:MM:SS,mmm)
   */
  private static framesToSRT(frame: number, fps: number): string {
    const totalSeconds = frame / fps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 1000);

    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(
      seconds,
      2
    )},${this.pad(milliseconds, 3)}`;
  }

  /**
   * Convert frame to VTT timestamp (HH:MM:SS.mmm)
   */
  private static framesToVTT(frame: number, fps: number): string {
    const totalSeconds = frame / fps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 1000);

    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(
      seconds,
      2
    )}.${this.pad(milliseconds, 3)}`;
  }

  private static pad(num: number, size: number): string {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
  }

  /**
   * Break long text into sentences for better chunking
   */
  static breakIntoSentences(script: string): string[] {
    return script
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
}
