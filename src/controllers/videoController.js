const Video = require('../models/Video');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const { FieldValue } = require('../firebase');

/**
 * Creates a new video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function createVideo(req, res) {
  try {
    const { uploaderId, workspaceId, storageUrl, metadata } = req.body;

    const user = await User.getById(uploaderId);
    const workspace = await Workspace.getById(workspaceId);

    if (user && workspace && (user.data.roles.creator || user.data.roles.editor)) {
      const video = new Video({
        uploader: uploaderId,
        workspaceId: workspaceId,
        storageUrl: storageUrl,
        metadata: metadata,
      });

      const videoRef = await video.create();

      // Update the workspace's pending_videos field with the new video ID
      await workspace.collection.doc(workspaceId.toString()).update({
        pending_videos: FieldValue.arrayUnion(videoRef.id),
      });

      res.status(200).json({ message: 'Video created successfully.' });
    } else {
      res.status(403).json({ error: 'User does not have the necessary permissions or workspace not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

/**
 * Retrieves video data by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function getVideoData(req, res) {
  try {
    const videoId = req.params.videoId;

    let video = await Video.getById(videoId.toString());

    if (video) {
      res.status(200).json(video.data);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

module.exports = { createVideo, getVideoData };
