const Video = require("../models/Video");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const { Youtube } = require("../youtube");
const upload = require("../multerConfig");
const multer = require("multer");
const { FieldValue } = require("../firebase");
const path = require('path');
const fs = require('fs');

/**
 * Creates a new video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function createVideo(uploaderId, workspaceId, videoFileName, metadata, thumbnailFileName) {
  try {
    // Check user and workspace permissions
    const user = await User.getById(uploaderId);
    const workspace = await Workspace.getById(workspaceId);
    if (
      !user ||
      !workspace ||
      !(user.data.roles.creator || user.data.roles.editor)
    ) {
      return { success: false };
    }

    const video = new Video({
      uploader: uploaderId,
      workspaceId: workspaceId,
      metadata: JSON.parse(metadata),
      videoFileName: videoFileName,
      thumbnailFileName: String(thumbnailFileName),
    });

    const videoRef = await video.create();

    // Update the workspace's pending_videos field with the new video ID
    await workspace.collection.doc(workspaceId.toString()).update({
      pending_videos: FieldValue.arrayUnion(videoRef.id),
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
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

/**
 * Upload a video file.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the upload is complete.
 */
async function uploadVideo(req, res) {
  try {
    upload.fields([{ name: 'video' }, { name: 'thumbnail' }])(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        res.status(400).json({ error: 'File upload error' });
      } else if (err) {
        console.error('Unknown error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const { uploaderId, workspaceId, metadata } = req.body;
        const videoFiles = req.files['video'];
        const thumbnailFiles = req.files['thumbnail'];

        if (!videoFiles || videoFiles.length === 0) {
          res.status(400).json({ error: 'Video file is required' });
          return;
        }
        let response;
        if (thumbnailFiles){
          response = await createVideo(uploaderId, workspaceId, videoFiles[0].filename, metadata, thumbnailFiles[0].filename);
        } else{
          response = await createVideo(uploaderId, workspaceId, videoFiles[0].filename, metadata);
        }
        if (response.success) {
          res.status(200).json({ message: 'Uploaded successfully & Video metadata uploaded successfully' });
        } else {
          res.status(500).json({ message: 'An error occurred during setting file to firestore' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

/**
 * Stream a video to the end user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {void}
 */
async function streamVideo(req, res) {
  try {
    const videoFilePath = './uploads/videos/' + req.params.filePath;
    const videoFileName = path.basename(videoFilePath);

    if (!fs.existsSync(videoFilePath)) {
      return res.status(404).send('Video not found');
    }

    res.setHeader('Content-Type', 'video/mp4');


    const videoStream = fs.createReadStream(videoFilePath);
    videoStream.pipe(res);

    videoStream.on('error', (error) => {
      console.error('Error streaming video:', error);
      res.status(500).send('An error occurred while streaming the video');
    });
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).send('An error occurred while streaming the video');
  }
}

async function getThumbnail(req, res){
  try {
    const filename = req.params.filename;
    const imagePath = path.join('./uploads/thumbnails', filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', 'image/jpeg');

    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);

    imageStream.on('error', (error) => {
      console.error('Error streaming image:', error);
      res.status(500).send('An error occurred while streaming the image');
    });
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).send('An error occurred while sending the image');
  }
}

module.exports = {
  createVideo,
  getVideoData,
  uploadToYT,
  uploadVideo,
  streamVideo,
  getThumbnail,
};
