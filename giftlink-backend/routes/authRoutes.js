const pino = require("pino");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcryptjs = require("bcryptjs");
const { body, header, validationResult } = require("express-validator");

const connectToDB = require("../models/db");
const authMiddleware = require("../middlewares/auth");
const { ObjectId } = require("mongodb");

const logger = pino();
const authRoutes = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

authRoutes.post(
  "/register",
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input" });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
      const db = await connectToDB();

      // Task 2: Access MongoDB collection
      const collection = db.collection("users");

      //Task 3: Check for existing email
      const existingUser = await collection.findOne({ email });

      if (existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);

      //Task 4: Save user details in database
      const result = await collection.insertOne({
        firstName,
        lastName,
        email,
        password: hash,
        createdAt: new Date(),
      });

      //Task 5: Create JWT authentication with user._id as payload
      const authtoken = jwt.sign({ userId: result.insertedId }, JWT_SECRET, {
        expiresIn: "1h",
      });

      logger.info(`User registered with email: ${email}`);
      res.json({ authtoken, email, name: `${firstName} ${lastName}` });
    } catch (error) {
      logger.error(error, "Error during registration");
      return res.status(500).send("Internal server error");
    }
  }
);

authRoutes.post(
  "/login",

  body("email").isEmail(),
  body("password").isLength({ min: 6 }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input" });
    }

    const { email, password } = req.body;

    try {
      // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
      const db = await connectToDB();

      // Task 2: Access MongoDB collection
      const collection = db.collection("users");

      // Task 3: Check if email exists
      const user = await collection.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Task 4: Compare password with hashed password in database
      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Task 5: Create JWT authentication with user._id as payload
      const authtoken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        authtoken,
        email,
        name: `${user.firstName} ${user.lastName}`,
      });

      logger.info(`User logged in with email: ${email}`);
    } catch (error) {
      logger.error(error, "Error during login");
      return res.status(500).send("Internal server error");
    }
  }
);

authRoutes.put(
  "/update",
  authMiddleware,
  body("firstName").optional().isString().notEmpty(),
  body("lastName").optional().isString().notEmpty(),
  body("password").optional().isLength({ min: 6 }),
  async (req, res) => {
    const _id = req.user.userId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error("Validation errors in update request", errors.array());

      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input" });
    }

    const email = req.header("email");

    if (!email) {
      logger.error("Email not found in the request headers");
      return res
        .status(400)
        .json({ error: "Email not found in the request headers" });
    }

    try {
      const db = await connectToDB();
      const collection = db.collection("users");

      const user = await collection.findOne({
        email,
      });

      if (!user) {
        logger.error(`User with email ${email} not found`);
        return res.status(404).json({ error: "User not found" });
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const { firstName, lastName, password } = req.body;

      /// Update user details

      if (firstName && lastName) {
        user.firstName = firstName.normalize("NFC");
        user.lastName = lastName;
      }

      if (password) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
      }

      user.updatedAt = new Date();

      /// Save updated user details in database
      const updatedUser = await collection.findOneAndUpdate(
        { email },
        { $set: user },
        { returnDocument: "after" }
      );

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update user" });
      }

      const authtoken = jwt.sign({ userId: updatedUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        authtoken,
        email,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      });
    } catch (error) {
      logger.error(error, "Error during user update");
      return res.status(500).send("Internal server error");
    }
  }
);

module.exports = authRoutes;
