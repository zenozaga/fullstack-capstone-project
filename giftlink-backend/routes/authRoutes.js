const pino = require("pino");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcryptjs = require("bcryptjs");

const { body, validationResult } = require("express-validator");

const connectToDB = require("../models/db");

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
        return res
          .status(409)
          .json({ message: "Email is already registered." });
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

module.exports = authRoutes;
