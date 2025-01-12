// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Register user
  router.post("/register", async (req, res) => {
    const { uid, name, email } = req.body;
    try {
      const userRef = db.collection("users").doc(uid);
      await userRef.set({
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to register user", details: error.message });
    }
  });

  // Login user
  router.post("/login", async (req, res) => {
    const { uid, email } = req.body;
    try {
      const userSnapshot = await db.collection("users").doc(uid).get();
      if (!userSnapshot.exists) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = userSnapshot.data();
      if (userData.email === email) {
        res.status(200).json({ message: "Login successful", user: userData });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  });

  return router;
};
