const jwt = require('jsonwebtoken');
const { secret } = require('../config')

function authenticateJWT(req, res, next) {
  // Define an array of paths that should be excluded from authentication
  const excludedPaths = ['/user'];

  // Check if the request path is in the excluded paths
  if (excludedPaths.includes(req.path) && req.method == 'POST') {
    return next(); // Skip authentication for the excluded paths
  }

  const token = req.header('Authorization');
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authentication error: Token missing' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication error: Invalid token' });
    }

    req.user = decoded.user;
    next();
  });
}

module.exports = authenticateJWT;