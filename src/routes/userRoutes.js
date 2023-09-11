const express = require("express");
const userController = require("../controllers/userController");
const {
  validateCreateAccount,
  validateGetUser,
  validateGetWorkspaces,
  isRequestValidated,
} = require("../validators/userValidator");

/**
 * Express router for user-related routes.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route for creating a user account.
 * @name POST/api/user/
 * @function
 * @memberof module:userroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.post(
  "/",
  validateCreateAccount,
  isRequestValidated,
  userController.createAccount
);

/**
 * Route for getting user data by ID.
 * @name GET/api/user/:id
 * @function
 * @memberof module:userroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.get(
  "/:id",
  validateGetUser,
  isRequestValidated,
  userController.getUserData
);

/**
 * Route for getting user workspaces data by creator ID.
 * @name GET/api/user/workspaces/:creatorId
 * @function
 * @memberof module:userroute
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for request validation.
 * @param {Function} controller - Controller function to handle the request.
 */
router.get(
  "/workspaces/:creatorId",
  validateGetWorkspaces,
  isRequestValidated,
  userController.getWorkspacesData
);

module.exports = router;
