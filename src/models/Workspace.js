const { db } = require('../firebase');

/**
 * Represents a workspace in the application.
 */
class Workspace {
  /**
   * Creates a new workspace.
   * @param {Object} data - Workspace data.
   * @param {string} data.name - The name of the workspace.
   * @param {string} data.creator - The ID of the creator of the workspace.
   * @param {string} [data.channel_id] - Youtube channel id.
   * @param {string[]} [data.editors=[]] - An array of editor IDs for the workspace.
   * @param {string[]} [data.pending_videos=[]] - An array of pending video IDs.
   * @param {string[]} [data.uploaded_videos=[]] - An array of uploaded video IDs.
   */
  constructor(data) {
    this.data = data;
    this.collection = db.collection('workspaces');
  }

  /**
   * Creates a new workspace in the database.
   * @returns {Promise<firebase.firestore.DocumentReference>} A promise that resolves with a reference to the created workspace.
   */
  async create() {
    return await this.collection.add(this.data);
  }

  /**
   * Retrieves a workspace by its ID.
   * @param {string} workspaceId - The ID of the workspace to retrieve.
   * @returns {Promise<Workspace|null>} A promise that resolves with the retrieved workspace or null if it doesn't exist.
   */
  static async getById(workspaceId) {
    const doc = await db.collection('workspaces').doc(workspaceId.toString()).get();
    if (!doc.exists) return null;
    return new Workspace(doc.data());
  }
}

module.exports = Workspace;
