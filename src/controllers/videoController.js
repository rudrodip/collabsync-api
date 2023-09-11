const Video = require("../models/Video");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const { Youtube } = require("../youtube");
const { FieldValue } = require("../firebase");

/**
 * Creates a new video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function createVideo(req, res) {
  try {
    const { uploaderId, workspaceId, storageUrl, metadata } = req.body;

    // Check user and workspace permissions
    const user = await User.getById(uploaderId);
    const workspace = await Workspace.getById(workspaceId);

    if (!user || !workspace || !(user.data.roles.creator || user.data.roles.editor)) {
      return res.status(403).json({ error: "User does not have the necessary permissions or workspace not found." });
    }

    // Create a new video
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

    res.status(200).json({ message: "Video created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
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

    // Retrieve video data by ID
    let video = await Video.getById(videoId.toString());

    if (video) {
      res.status(200).json(video.data);
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
}

/**
 * Uploads a video to YouTube.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function uploadToYT(req, res) {
  try {
    const { videoId, ownerId } = req.body;

    // Retrieve video and user data
    const video = await Video.getById(videoId);
    const user = await User.getById(ownerId);

    if (!user || !video) {
      return res.status(404).json({ message: "User or Video not found" });
    }

    // Extract necessary data
    const access_token = user.data.access_token;
    const refresh_token = user.data.refresh_token;
    const metadata = video.data.metadata;

    // Initialize the YouTube API client
    const youtube = new Youtube(access_token, refresh_token);

    // Upload the video to YouTube
    const data = await youtube.upload("custompath", metadata);

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
}

module.exports = { createVideo, getVideoData, uploadToYT };
