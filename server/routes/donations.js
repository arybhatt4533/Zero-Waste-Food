const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST: नया डोनेशन
router.post('/', upload.single('foodImage'), async (req, res) => {
    try {
        const { foodName, quantity, restaurantName, expiry, location } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `INSERT INTO donations 
            (food_name, quantity, restaurant_name, expiry_time, location, image_url, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'available') RETURNING *`;
        
        await pool.query(query, [foodName, quantity, restaurantName, expiry, location, imageUrl]);
        res.status(200).json({ message: "Donation added!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: सिर्फ available खाना
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM donations WHERE status = 'available' ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH: क्लेम करने के लिए
router.patch('/claim/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE donations SET status = 'claimed' WHERE id = $1", [id]);
        res.json({ message: "Claimed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;