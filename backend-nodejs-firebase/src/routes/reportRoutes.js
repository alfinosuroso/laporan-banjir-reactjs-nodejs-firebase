const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer to store images in the `src/assets` folder with a random name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/assets/"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    const randomName = `${Date.now()}_${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, randomName); // Use random name for the uploaded file
  },
});

const upload = multer({ storage: storage });

module.exports = (db) => {
  // Create new report
  router.post("/", upload.single("image"), async (req, res) => {
    const { reportData } = req.body; // Get the JSON part of the report data
    const { title, description, location, height, weather, uid, author } =
      JSON.parse(reportData);
    const file = req.file; // The uploaded image file

    console.log("Received report data:", req.body);

    // Validate that required fields are provided
    if (!title || !description || !location || !uid || !author || !file) {
      return res
        .status(400)
        .json({ error: "Missing required fields or image" });
    }

    try {
      // Construct the image path to store in the report
      const imagePath = `/assets/${file.filename}`;

      // Store the report in the database (or Firestore, MongoDB, etc.)
      const reportRef = db.collection("reports").doc();
      await reportRef.set({
        title,
        description,
        location,
        height,
        weather,
        uid,
        author,
        image: imagePath, // Save the image path
        createdAt: new Date().toISOString(),
      });

      res.status(201).json({
        message: "Report created successfully",
        imagePath, // Send the image path back as part of the response
      });
    } catch (error) {
      console.error("Error storing report:", error.message);
      res
        .status(500)
        .json({ error: "Failed to store report", details: error.message });
    }
  });

  // Get all reports sorted by createdAt (newest first)
  router.get("/", async (req, res) => {
    try {
      const snapshot = await db
        .collection("reports")
        .orderBy("createdAt", "desc")
        .get();

      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json(reports);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch reports", details: error.message });
    }
  });

  // Get reports for a specific user by UID, sorted by createdAt (newest first)
  router.get("/:uid", async (req, res) => {
    const { uid } = req.params; // Extract UID from the URL
    try {
      const snapshot = await db
        .collection("reports")
        .where("uid", "==", uid)
        .get();
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch reports for the user",
        details: error.message,
      });
    }
  });

  // Update a report with file upload
  router.put("/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;

    const reportData = req.body.reportData;
    if (!reportData) {
      return res.status(400).json({ error: "Missing report data" });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(reportData);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid JSON format in report data" });
    }

    const { title, description, location, height, weather } = parsedData;
    const file = req.file; // The uploaded image file

    try {
      const reportRef = db.collection("reports").doc(id);
      const reportDoc = await reportRef.get();
      const reportData = reportDoc.data();
      const imagePath = reportData.image;

      // Construct the updated data
      let updatedData = {
        title,
        description,
        location,
        height,
        weather,
      };

      if (file) {
        const imagePath = `/assets/${file.filename}`;
        updatedData.image = imagePath;
      }

      // Delete the image from the file system if it exists
      if (imagePath) {
        const fullImagePath = path.join(__dirname, "..", imagePath); // Adjust path if necessary
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err.message);
          } else {
            console.log("Image deleted successfully:", imagePath);
          }
        });
      }

      // Update the report in the database
      await reportRef.update(updatedData);

      res.status(200).json({
        message: "Report updated successfully",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update report",
        details: error.message,
      });
    }
  });

  // Delete a report
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const reportRef = db.collection("reports").doc(id);
      const reportDoc = await reportRef.get();

      if (!reportDoc.exists) {
        return res.status(404).json({ error: "Report not found" });
      }

      const reportData = reportDoc.data();
      const imagePath = reportData.image;

      // Delete the report from the database
      await reportRef.delete();

      // Delete the image from the file system if it exists
      if (imagePath) {
        const fullImagePath = path.join(__dirname, "..", imagePath); // Adjust path if necessary
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err.message);
          } else {
            console.log("Image deleted successfully:", imagePath);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Report and associated image deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete report", details: error.message });
    }
  });

  return router;
};
