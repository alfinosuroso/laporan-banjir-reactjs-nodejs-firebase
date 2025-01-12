// src/app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const laporanBanjirRoutes = require("./routes/reportRoutes");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require("./config/serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(cors());
app.use(bodyParser.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/api/users", userRoutes(db));
app.use("/api/reports", laporanBanjirRoutes(db));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API Users di http://localhost:${port}/api/users`);
  console.log(`API Laporan Banjir di http://localhost:${port}/api/reports`);
  console.log(`Assets di http://localhost:${port}/assets`);
});
