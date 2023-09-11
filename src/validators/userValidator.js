const { check, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a user account.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateCreateAccount = [
  check('id')
    .isLength({ min: 6 })
    .withMessage('User ID must be at least 6 characters long'),
  check('email').isEmail().withMessage('Valid email is required'),
];

/**
 * Validation middleware for getting user information.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetUser = [
  check('id')
    .isLength({ min: 6 })
    .withMessage('User ID must be at least 6 characters long'),
];

/**
 * Validation middleware for getting user workspaces.
 * @type {import('express-validator').ValidationChain[]}
 */
const validateGetWorkspaces = [
  check('creatorId')
    .isLength({ min: 6 })
    .withMessage('Creator ID must be at least 6 characters long'),
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
  validateCreateAccount,
  validateGetUser,
  validateGetWorkspaces,
  isRequestValidated,
};
