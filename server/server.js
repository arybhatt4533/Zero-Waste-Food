require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donations");
const ngoRoutes = require("./routes/ngo");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors({
    origin: "*", // आप चाहें तो यहाँ अपने फ्रंटएंड का URL (जैसे http://localhost:5173) भी लिख सकते हैं
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// Test Routes
// ======================
app.get("/", (req, res) => {
    res.send("Zero Waste Food API Running");
});

app.get("/hello", (req, res) => {
    res.send("Hello Server");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            time: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ======================
// API Routes
// ======================
app.use("/auth", authRoutes);
app.use("/donations", donationRoutes);
app.use("/ngo", ngoRoutes);
app.use("/admin", adminRoutes);

// ======================
// 404 Route
// ======================
app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});