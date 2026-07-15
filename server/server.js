require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const ngoRoutes = require("./routes/ngo");
const adminRoutes = require("./routes/admin");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/ngo", ngoRoutes);
app.use("/admin", adminRoutes);

// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');

app.use('/auth', authRoutes);
app.use('/donations', donationRoutes);

// Database Connection Test
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Database connected successfully!", time: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});
app.get("/hello", (req, res) => {
    res.send("Hello Server");
});
// Agar tum Frontend (HTML/CSS) direct server se serve karna chahti ho:
// app.use(express.static(path.join(__dirname, '../client/build')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});