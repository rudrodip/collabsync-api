const { db } = require('../firebase');

/**
 * Represents a user in the application.
 */
class User {
  /**
   * Creates a new user.
   * @param {Object} data - User data.
   * @param {string} data.id - The user's unique ID.
   * @param {string} [data.access_token] - The user's access token (optional).
   * @param {string} [data.refresh_token] - The user's refresh token (optional).
   * @param {number} [data.expires_at] - The expiration timestamp for tokens (optional).
   * @param {Object} [data.roles] - User roles (optional).
   * @param {boolean} [data.roles.creator] - Indicates if the user is a creator (optional).
   * @param {boolean} [data.roles.editor] - Indicates if the user is an editor (optional).
   * @param {string[]} [data.workspaces] - IDs of workspaces associated with the user (optional).
   */
  constructor(data) {
    this.data = data;
    this.collection = db.collection('users');
  }

  /**
   * Creates a new user in the database.
   * @returns {Promise<void>} A promise that resolves when the user is created.
   */
  async create() {
    await this.collection.doc(this.data.id.toString()).set(this.data);
  }

  /**
   * Retrieves a user by their ID.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<User|null>} A promise that resolves with the retrieved user or null if they don't exist.
   */
  static async getById(userId) {
    const doc = await db.collection('users').doc(userId.toString()).get();
    if (!doc.exists) return null;
    return new User(doc.data());
  }
}

module.exports = User;
