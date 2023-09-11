const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Video = require('../models/Video');
const { FieldValue } = require('../firebase');

/**
 * Creates a new workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function createWorkspace(req, res) {
  try {
    const { userId, workspaceName } = req.body;

    const user = await User.getById(userId);

    if (user && user.data.roles.creator) {
      const workspace = new Workspace({
        creator: userId,
        name: workspaceName,
        editors: [],
        pending_videos: [],
        uploaded_videos: [],
      });

      const workspaceRef = await workspace.create();

      // Update the user's workspaces field with the new workspace ID
      await user.collection.doc(userId.toString()).update({
        workspaces: FieldValue.arrayUnion(workspaceRef.id),
      });

      res.status(200).json({ id: workspaceRef.id, message: 'Workspace created successfully.' });
    } else {
      res.status(403).json({ error: 'User does not have the necessary permissions.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

/**
 * Retrieves workspace data by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function getWorkspaceData(req, res) {
  try {
    const workspaceId = req.params.workspaceId;

    let workspace = await Workspace.getById(workspaceId.toString());

    if (workspace) {
      res.status(200).json({ id: workspaceId, ...workspace.data });
    } else {
      res.status(404).json({ message: 'Workspace not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

/**
 * Retrieves videos data within a workspace by workspace ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function getVideosData(req, res) {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.getById(workspaceId.toString());
    let videos = { pending: [], uploaded: [] };

    await Promise.all(
      workspace.data.pending_videos.map(async (v) => {
        try {
          const videoData = await Video.getById(v.toString());
          videos.pending.push({ id: v, ...videoData.data });
        } catch (err) {
          console.error(err);
        }
      })
    );

    await Promise.all(
      workspace.data.uploaded_videos.map(async (v) => {
        try {
          const videoData = await Video.getById(v.toString());
          videos.uploaded.push({ id: v, ...videoData.data });
        } catch (err) {
          console.error(err);
        }
      })
    );

    res.status(200).json({ videos: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

module.exports = { createWorkspace, getWorkspaceData, getVideosData };
