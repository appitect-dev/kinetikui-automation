import axios from "axios";
import { logger } from "../utils/logger";

const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class InstagramAPI {
  private accessToken: string;
  private accountId: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  /**
   * Create a container for video upload
   */
  async createMediaContainer(videoUrl: string, caption: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.accountId}/media`,
        {
          media_type: "REELS",
          video_url: videoUrl,
          caption: caption,
          share_to_feed: true,
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      );

      logger.info(`Media container created: ${response.data.id}`);
      return response.data.id;
    } catch (error: any) {
      logger.error("Failed to create media container:", error.response?.data || error.message);
      throw new Error(`Instagram API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Check container status
   */
  async checkContainerStatus(containerId: string): Promise<{ status: string; statusCode: string }> {
    try {
      const response = await axios.get(`${GRAPH_API_BASE}/${containerId}`, {
        params: {
          fields: "status,status_code",
          access_token: this.accessToken,
        },
      });

      return {
        status: response.data.status,
        statusCode: response.data.status_code,
      };
    } catch (error: any) {
      logger.error("Failed to check container status:", error.response?.data || error.message);
      throw new Error(`Instagram API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Publish the media container
   */
  async publishMedia(containerId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.accountId}/media_publish`,
        {
          creation_id: containerId,
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      );

      logger.info(`Media published: ${response.data.id}`);
      return response.data.id;
    } catch (error: any) {
      logger.error("Failed to publish media:", error.response?.data || error.message);
      throw new Error(`Instagram API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Upload video to Instagram (full flow)
   */
  async uploadVideo(videoUrl: string, caption: string): Promise<string> {
    logger.info(`Starting Instagram upload: ${caption.substring(0, 50)}...`);

    // Step 1: Create container
    const containerId = await this.createMediaContainer(videoUrl, caption);

    // Step 2: Wait for processing (poll every 5 seconds, max 5 minutes)
    const maxAttempts = 60;
    let attempts = 0;
    let status = "IN_PROGRESS";

    while (attempts < maxAttempts && status !== "FINISHED") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      const containerStatus = await this.checkContainerStatus(containerId);
      status = containerStatus.statusCode;

      logger.info(`Container status check ${attempts + 1}/${maxAttempts}: ${status}`);

      if (status === "ERROR") {
        throw new Error("Instagram video processing failed");
      }

      attempts++;
    }

    if (status !== "FINISHED") {
      throw new Error("Instagram video processing timeout");
    }

    // Step 3: Publish
    const mediaId = await this.publishMedia(containerId);
    return mediaId;
  }

  /**
   * Get insights/metrics for a media item
   */
  async getMediaInsights(mediaId: string): Promise<any> {
    try {
      const response = await axios.get(`${GRAPH_API_BASE}/${mediaId}/insights`, {
        params: {
          metric: "likes,comments,saves,shares,plays,reach,total_interactions",
          access_token: this.accessToken,
        },
      });

      return response.data.data;
    } catch (error: any) {
      logger.error("Failed to fetch insights:", error.response?.data || error.message);
      throw new Error(`Instagram API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Validate access token
   */
  async validateToken(): Promise<boolean> {
    try {
      await axios.get(`${GRAPH_API_BASE}/${this.accountId}`, {
        params: {
          fields: "username",
          access_token: this.accessToken,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
