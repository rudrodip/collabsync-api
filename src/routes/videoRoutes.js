const express = require("express");
const videoController = require("../controllers/videoController");
const {
  validateCreateVideo,
  validateGetVideoData,
  isRequestValidated,
} = require("../validators/videoValidator");

/**
 * Express router for video-related routes.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route for getting video data by ID.
 * @name GET/api/video/:videoId
 * @function
 * @memberof module:videoroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.get(
  "/:videoId",
  validateGetVideoData,
  isRequestValidated,
  videoController.getVideoData
);

/**
 * Route for uploading a video to YouTube.
 * @name POST/api/video/uploadyt
 * @function
 * @memberof module:videoroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.post(
  "/uploadyt",
  isRequestValidated,
  videoController.uploadToYT
);

/**
 * Route for uploading a video to collabsync server.
 * @name POST/api/video/upload
 * @function
 * @memberof module:videoroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.post(
  "/upload",
  isRequestValidated,
  videoController.uploadVideo
);

router.get(
  "/stream/:filePath",
  isRequestValidated,
  videoController.streamVideo
)

router.get(
  "/thumbnail/:filename",
  isRequestValidated,
  videoController.getThumbnail
)


module.exports = router;
