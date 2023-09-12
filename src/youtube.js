const { google } = require("googleapis");
const { client_id, client_secret } = require("./config");
const fs = require("fs");

/**
 * YouTube API client for uploading videos, managing playlists, and more.
 */
class Youtube {
  /**
   * Create a YouTube instance.
   * @param {string} userAccessToken - User's access token.
   * @param {string} refreshToken - User's refresh token.
   */
  constructor(userAccessToken, refreshToken) {
    this.access_token = userAccessToken;
    this.scopes = [
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.upload",
    ];

    /**
     * OAuth2 client for YouTube API.
     * @type {google.auth.OAuth2}
     */
    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      "http://localhost"
    );

    this.oauth2Client.setCredentials({
      access_token: this.access_token,
      refresh_token: refreshToken,
    });

    /**
     * YouTube API client instance.
     * @type {google.youtube}
     */
    this.youtube = google.youtube({
      version: "v3",
      auth: this.oauth2Client,
    });

    /**
     * YouTube Analytics API client instance.
     * @type {google.youtubeAnalytics}
     */
    this.youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: this.oAuth2Client
    });
  }

  /**
   * Upload a video to YouTube with metadata.
   * @param {string} local_path - Local path to the video file.
   * @param {Object} metadata - Video metadata.
   * @param {string} metadata.title - Video title.
   * @param {string} metadata.desc - Video description.
   * @param {string[]} metadata.tags - Video tags.
   * @param {string} metadata.privacyStatus - Video privacy status (e.g., 'private').
   * @returns {Promise<Object>} - Uploaded video data.
   */
  async upload(local_path, metadata) {
    const videoMetadata = {
      snippet: {
        title: metadata.title,
        description: metadata.desc,
        tags: metadata.tags,
      },
      status: {
        privacyStatus: metadata.privacyStatus,
      },
    };

    try {
      const res = await this.youtube.videos.insert({
        part: "snippet,status",
        media: {
          body: fs.createReadStream(local_path),
        },
        resource: videoMetadata,
        media: {
          body: fs.createReadStream("/home/rudrodip/Downloads/yo.jpeg"),
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  }

  /**
   * List user's YouTube channels.
   * @returns {Promise<Object[]>} - Array of user's channels.
   */
  async listUserChannels() {
    try {
      const response = await this.youtube.channels.list({
        auth: this.oauth2Client,
        part: "snippet",
        mine: true,
        maxResults: 10,
      });

      console.log("User's Channels:");
      for (const channel of response.data.items) {
        console.log(`Title: ${channel.snippet.title}`);
      }

      return response.data.items;
    } catch (error) {
      console.error("Error listing user's channels:", error);
      throw error;
    }
  }

  /**
   * Get channel data by channel ID.
   * @param {string} channelId - YouTube channel ID.
   * @returns {Promise<Object>} - Channel data.
   */
  async getChannelById(channelId) {
    try {
      const response = await this.youtube.channels.list({
        auth: this.oauth2Client,
        part: "snippet",
        id: channelId,
      });

      if (response.data.items.length > 0) {
        const channelData = response.data.items[0];
        return channelData;
      } else {
        console.log("Channel not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting channel data:", error);
      throw error;
    }
  }

  /**
   * Get channel analytics data.
   * @param {string} channelId - The ID of the channel to retrieve analytics for.
   * @returns {Promise<Object>} - Channel analytics data.
   */
  async getChannelAnalytics(channelId, startDate="2023-01-01") {
    try {
      const response = await this.youtubeAnalytics.reports.query({
        auth: this.oauth2Client,
        ids: `channel==${channelId}`,
        startDate: startDate,
        endDate: new Date().toISOString().slice(0, 10),
        metrics: "views,comments,likes,dislikes,shares",
        dimensions: 'day',
        sort: 'day'
      });

      return response.data;
    } catch (error) {
      console.error("Error retrieving channel analytics:", error);
      throw error;
    }
  }

  /**
   * Get the best-performing videos for a channel.
   * @param {string} channelId - The ID of the channel to retrieve videos for.
   * @param {number} maxResults - The maximum number of videos to retrieve.
   * @returns {Promise<Object[]>} - Array of best-performing videos.
   */
  async getBestPerformingVideos(channelId, maxResults = 10) {
    try {
      const response = await this.youtube.search.list({
        auth: this.oauth2Client,
        part: "id",
        channelId,
        maxResults,
        order: "viewCount",
        type: "video",
      });

      const videoIds = response.data.items.map((item) => item.id.videoId);

      const videoDetailsResponse = await this.youtube.videos.list({
        auth: this.oauth2Client,
        part: "snippet,statistics",
        id: videoIds.join(","),
      });

      return videoDetailsResponse.data.items;
    } catch (error) {
      console.error("Error retrieving best-performing videos:", error);
      throw error;
    }
  }
}

module.exports = { Youtube };
