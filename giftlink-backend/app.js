/*jshint esversion: 8 */
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const logger = require("./logger");
const pinoLogger = require("./logger");
const pinoHttp = require("pino-http");

const connectToDatabase = require("./models/db");
const { loadData } = require("./util/import-mongo/index");

// Routes
const authRoutes = require("./routes/authRoutes");
const giftRoutes = require("./routes/giftRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase()
  .then(() => {
    pinoLogger.info("Connected to DB");
  })
  .catch((e) => console.error("Failed to connect to DB", e));



// Middleware
app.use(express.json());
app.use("*", cors());
app.use(pinoHttp({ logger }));



// Use Routers
app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/search", searchRoutes);



// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});



app.get("/", (req, res) => {
  res.send("Inside the server");
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
