import axios from "axios";
import * as fs from "fs/promises";
import * as path from "path";
import { logger } from "../utils/logger";

export interface VoicePreset {
  id: string;
  name: string;
  provider: "elevenlabs" | "google" | "azure";
  voiceId: string;
  description: string;
  gender: "male" | "female";
  style: "energetic" | "calm" | "professional" | "casual";
}

export interface VoiceGenerationOptions {
  text: string;
  voicePresetId: string;
  speakingRate?: number; // 0.5 to 2.0
  pitch?: number; // -20 to 20 semitones
  stability?: number; // 0.0 to 1.0 (ElevenLabs)
  similarityBoost?: number; // 0.0 to 1.0 (ElevenLabs)
}

export interface VoiceGenerationResult {
  audioPath: string;
  duration: number;
  provider: string;
  cached: boolean;
}

// Predefined voice presets
export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: "male-energetic",
    name: "Adam - Energetic Male",
    provider: "elevenlabs",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam from ElevenLabs
    description: "Dynamic and engaging male voice, perfect for tech content",
    gender: "male",
    style: "energetic",
  },
  {
    id: "female-professional",
    name: "Rachel - Professional Female",
    provider: "elevenlabs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel from ElevenLabs
    description: "Clear and professional female voice, great for tutorials",
    gender: "female",
    style: "professional",
  },
  {
    id: "male-calm",
    name: "Antoni - Calm Male",
    provider: "elevenlabs",
    voiceId: "ErXwobaYiN019PkySvjV", // Antoni from ElevenLabs
    description: "Soothing male voice, ideal for explanatory content",
    gender: "male",
    style: "calm",
  },
  {
    id: "female-energetic",
    name: "Elli - Energetic Female",
    provider: "elevenlabs",
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli from ElevenLabs
    description: "Vibrant and enthusiastic female voice",
    gender: "female",
    style: "energetic",
  },
  {
    id: "male-professional",
    name: "Josh - Professional Male",
    provider: "elevenlabs",
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh from ElevenLabs
    description: "Confident and clear male voice for business content",
    gender: "male",
    style: "professional",
  },
];

export class VoiceService {
  private elevenLabsApiKey: string | undefined;
  private audioDir: string;
  private cacheDir: string;

  constructor() {
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    this.audioDir = path.join(__dirname, "../../../audio");
    this.cacheDir = path.join(__dirname, "../../../audio/cache");
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.audioDir, { recursive: true });
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      logger.error("Failed to create audio directories:", error);
    }
  }

  // Get cache key for a generation request
  private getCacheKey(options: VoiceGenerationOptions): string {
    const { text, voicePresetId, speakingRate = 1.0, pitch = 0 } = options;
    const hash = Buffer.from(`${voicePresetId}:${text}:${speakingRate}:${pitch}`).toString("base64");
    return hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 32);
  }

  // Check if audio is cached
  private async checkCache(cacheKey: string): Promise<string | null> {
    const cachedPath = path.join(this.cacheDir, `${cacheKey}.mp3`);
    try {
      await fs.access(cachedPath);
      logger.info(`Cache hit for ${cacheKey}`);
      return cachedPath;
    } catch {
      return null;
    }
  }

  // Generate audio with ElevenLabs
  private async generateWithElevenLabs(
    text: string,
    voiceId: string,
    options: VoiceGenerationOptions
  ): Promise<string> {
    if (!this.elevenLabsApiKey) {
      throw new Error("ElevenLabs API key not configured");
    }

    const { stability = 0.5, similarityBoost = 0.75 } = options;

    try {
      logger.info(`Generating audio with ElevenLabs (voice: ${voiceId})`);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        },
        {
          headers: {
            "xi-api-key": this.elevenLabsApiKey,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBuffer = Buffer.from(response.data);
      const fileName = `${Date.now()}_${voiceId}.mp3`;
      const outputPath = path.join(this.audioDir, fileName);

      await fs.writeFile(outputPath, audioBuffer);
      logger.info(`Audio saved to ${outputPath}`);

      return outputPath;
    } catch (error: any) {
      logger.error("ElevenLabs generation failed:", error.response?.data || error.message);
      throw new Error(`ElevenLabs API error: ${error.message}`);
    }
  }

  // Fallback: Generate with Google Cloud TTS (placeholder)
  private async generateWithGoogle(
    text: string,
    voiceId: string,
    options: VoiceGenerationOptions
  ): Promise<string> {
    // TODO: Implement Google Cloud TTS as fallback
    throw new Error("Google TTS fallback not yet implemented");
  }

  // Generate voiceover audio
  async generate(options: VoiceGenerationOptions): Promise<VoiceGenerationResult> {
    const cacheKey = this.getCacheKey(options);

    // Check cache first
    const cachedPath = await this.checkCache(cacheKey);
    if (cachedPath) {
      const duration = await this.getAudioDuration(cachedPath);
      return {
        audioPath: cachedPath,
        duration,
        provider: "cache",
        cached: true,
      };
    }

    // Find voice preset
    const preset = VOICE_PRESETS.find((p) => p.id === options.voicePresetId);
    if (!preset) {
      throw new Error(`Voice preset not found: ${options.voicePresetId}`);
    }

    let audioPath: string;

    // Generate with appropriate provider
    if (preset.provider === "elevenlabs") {
      audioPath = await this.generateWithElevenLabs(options.text, preset.voiceId, options);
    } else if (preset.provider === "google") {
      audioPath = await this.generateWithGoogle(options.text, preset.voiceId, options);
    } else {
      throw new Error(`Unsupported provider: ${preset.provider}`);
    }

    // Cache the generated audio
    const cachePath = path.join(this.cacheDir, `${cacheKey}.mp3`);
    await fs.copyFile(audioPath, cachePath);

    const duration = await this.getAudioDuration(audioPath);

    return {
      audioPath,
      duration,
      provider: preset.provider,
      cached: false,
    };
  }

  // Get audio duration (simplified - in production use ffprobe)
  private async getAudioDuration(filePath: string): Promise<number> {
    // Simplified: estimate ~150 words per minute
    // In production, use ffprobe or similar to get actual duration
    try {
      const stats = await fs.stat(filePath);
      // Rough estimate: 1KB = ~0.1 seconds for MP3
      return Math.round((stats.size / 1024) * 0.1);
    } catch {
      return 10; // Default fallback
    }
  }

  // Generate script from template props
  generateScript(compositionId: string, props: any): string {
    // Auto-generate narration script based on template type and props
    switch (compositionId) {
      case "TutorialSnippet":
        return this.generateTutorialScript(props);
      case "FeatureHighlight":
        return this.generateFeatureScript(props);
      case "ProblemSolution":
        return this.generateProblemSolutionScript(props);
      case "Comparison":
        return this.generateComparisonScript(props);
      case "SocialProof":
        return this.generateSocialProofScript(props);
      default:
        return this.generateGenericScript(props);
    }
  }

  private generateTutorialScript(props: any): string {
    const { title, steps } = props;
    let script = `${title}. Here's how to do it. `;
    
    steps?.forEach((step: any, index: number) => {
      script += `Step ${index + 1}: ${step.text}. `;
    });
    
    script += "And that's it! Follow Kinetik UI for more tips.";
    return script;
  }

  private generateFeatureScript(props: any): string {
    const { title, subtitle, features } = props;
    let script = `${title}. ${subtitle || ""}. `;
    
    if (features && features.length > 0) {
      script += "Key features include: ";
      features.forEach((feature: any) => {
        script += `${feature.title}. ${feature.description}. `;
      });
    }
    
    return script;
  }

  private generateProblemSolutionScript(props: any): string {
    const { problem, solution } = props;
    return `${problem}. Here's the solution: ${solution}. Try it today!`;
  }

  private generateComparisonScript(props: any): string {
    const { title, items } = props;
    let script = `${title}. Let's compare. `;
    
    items?.forEach((item: any) => {
      script += `${item.name}: ${item.description}. `;
    });
    
    return script;
  }

  private generateSocialProofScript(props: any): string {
    const { title, testimonials } = props;
    let script = `${title}. Don't just take our word for it. `;
    
    testimonials?.forEach((testimonial: any) => {
      script += `${testimonial.author} says: ${testimonial.text}. `;
    });
    
    return script;
  }

  private generateGenericScript(props: any): string {
    const { title, subtitle, description } = props;
    return `${title}. ${subtitle || ""}. ${description || ""}`.trim();
  }

  // Get all available voice presets
  getPresets(): VoicePreset[] {
    return VOICE_PRESETS;
  }
}
