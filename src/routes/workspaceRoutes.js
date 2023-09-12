const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const {
  validateCreateWorkspace,
  validateGetWorkspace,
  validateGetVideos,
  validateGetChannel,
  isRequestValidated,
} = require("../validators/workspaceValidator");

/**
 * Express router for workspace-related routes.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route for creating a new workspace.
 * @name POST/api/workspace/
 * @function
 * @memberof module:workspaceroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.post(
  "/",
  validateCreateWorkspace,
  isRequestValidated,
  workspaceController.createWorkspace
);

/**
 * Route for getting workspace data by ID.
 * @name GET/api/workspace/:workspaceId
 * @function
 * @memberof module:workspaceroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.get(
  "/:workspaceId",
  validateGetWorkspace,
  isRequestValidated,
  workspaceController.getWorkspaceData
);

/**
 * Route for getting videos data within a workspace by workspace ID.
 * @name GET/api/workspace/videos/:workspaceId
 * @function
 * @memberof module:workspaceroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.get(
  "/videos/:workspaceId",
  validateGetVideos,
  isRequestValidated,
  workspaceController.getVideosData
);

router.post(
  "/channel",
  validateGetChannel,
  isRequestValidated,
  workspaceController.getChannel
);

router.post(
  "/channel-analytics",
  validateGetChannel,
  isRequestValidated,
  workspaceController.getChannelAnalytics
);

router.post(
  "/channel-bestvideos",
  validateGetChannel,
  isRequestValidated,
  workspaceController.getBestVideos
);

module.exports = router;
