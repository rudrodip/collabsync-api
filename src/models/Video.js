const { db } = require('../firebase');

/**
 * Represents a video in the application.
 */
class Video {
  /**
   * Creates a new video.
   * @param {Object} data - Video data.
   * @param {string} data.uploader - The ID of the user who uploaded the video.
   * @param {string} [data.approver] - The ID of the user who approved the video (optional).
   * @param {string} data.workspaceId - The ID of the workspace where the video belongs.
   * @param {string} data.storageUrl - The URL where the video is stored.
   * @param {Object} data.metadata - Metadata associated with the video.
   * @param {string} data.metadata.title - The title of the video.
   * @param {string} data.metadata.description - The description of the video.
   * @param {string} data.metadata.author - The author of the video.
   * @param {string} data.metadata.format - The format of the video.
   * ... other metadata fields as needed
   */
  constructor(data) {
    this.data = data;
    this.collection = db.collection('videos');
  }

  /**
   * Creates a new video in the database.
   * @returns {Promise<firebase.firestore.DocumentReference>} A promise that resolves with a reference to the created video.
   */
  async create() {
    return await this.collection.add(this.data);
  }

  /**
   * Retrieves a video by its ID.
   * @param {string} id - The ID of the video to retrieve.
   * @returns {Promise<Video|null>} A promise that resolves with the retrieved video or null if it doesn't exist.
   */
  static async getById(id) {
    const doc = await db.collection('videos').doc(id.toString()).get();
    if (!doc.exists) return null;
    return new Video(doc.data());
  }
}

module.exports = Video;
