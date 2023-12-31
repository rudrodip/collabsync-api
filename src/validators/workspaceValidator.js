const { check, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a workspace.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateCreateWorkspace = [
  check('workspaceName')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  check('userId')
    .isLength({ min: 6 })
    .withMessage('Creator ID must be at least 6 characters long'),
];

/**
 * Validation middleware for getting workspace data.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetWorkspace = [
  check('workspaceId')
    .isLength({ min: 6 })
    .withMessage('Workspace ID must be at least 6 characters long'),
];

/**
 * Validation middleware for getting videos within a workspace.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetVideos = [
  check('workspaceId')
    .isLength({ min: 6 })
    .withMessage('Workspace ID must be at least 6 characters long'),
];

/**
 * Validation middleware for getting videos within a workspace.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetChannel = [
  check('workspaceId')
    .isLength({ min: 6 })
    .withMessage('Workspace ID must be at least 6 characters long'),
  check('userId')
    .isLength({ min: 6 })
    .withMessage('User ID must be at least 6 characters long'),
];


/**
 * Middleware to check if request is validated. If not, returns a 400 response with the first validation error message.
 * @function
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 */
const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  validateCreateWorkspace,
  validateGetWorkspace,
  validateGetVideos,
  validateGetChannel,
  isRequestValidated,
};
