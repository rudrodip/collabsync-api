const { check, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a video.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateCreateVideo = [
  check('uploaderId')
    .isLength({ min: 6 })
    .withMessage('User ID must be at least 6 characters long'),
  check('workspaceId')
    .isLength({ min: 6 })
    .withMessage('Workspace ID must be at least 6 characters long'),
  check('storageUrl')
    .isURL()
    .withMessage('Storage URL is not a valid URL'),
];

/**
 * Validation middleware for getting video data.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetVideoData = [
  check('videoId')
    .isLength({ min: 6 })
    .withMessage('Video ID must be at least 6 characters long'),
];

/**
 * Validation middleware for getting videos.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetVideos = [
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
  validateCreateVideo,
  validateGetVideoData,
  validateGetVideos,
  isRequestValidated,
};
