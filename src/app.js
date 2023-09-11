const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const morgan = require("morgan");

const file = fs.readFileSync(path.resolve(__dirname, "./swaggerDef.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const customLogFormat = ':method :url :status :response-time ms - :res[content-length]';

const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use custom log format and skip favicon requests in Morgan
app.use(morgan(customLogFormat, { skip: (req, _) => req.originalUrl === "/favicon.ico" }));

app.use(cors());
app.use(helmet());

// Import routes
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const videoRoutes = require("./routes/videoRoutes");

app.use("/api/user", userRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/video", videoRoutes);

// Serve Swagger UI
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none",
    },
    customSiteTitle: "CollabSync API docs",
  })
);

module.exports = app;
