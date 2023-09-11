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
    this.scopes = ["https://www.googleapis.com/auth/youtube"];

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
   * Get a list of user's playlists.
   * @returns {Promise<Object[]>} - Array of playlists.
   */
  async getMyPlaylists() {
    try {
      const response = await this.youtube.playlists.list({
        auth: this.oauth2Client,
        part: "snippet",
        mine: true,
        maxResults: 10,
      });

      const playlists = response.data.items;
      return playlists;
    } catch (error) {
      console.error("Error retrieving playlists:", error);
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
}

module.exports = { Youtube };
