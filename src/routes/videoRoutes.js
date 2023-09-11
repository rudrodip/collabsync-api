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
 * Route for creating a new video.
 * @name POST/api/video/
 * @function
 * @memberof module:videoroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.post(
  "/",
  validateCreateVideo,
  isRequestValidated,
  videoController.createVideo
);

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

module.exports = router;