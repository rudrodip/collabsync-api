/**
 * Main entry point for the server application.
 * @module server
 */

const app = require('./app');
const config = require('./config');

/**
 * Start the Express server.
 * @function
 * @param {number} port - The port number to listen on.
 */
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
