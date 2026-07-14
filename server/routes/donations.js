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

// PATCH: NGO Claim Food
router.patch("/claim/:id", async (req, res) => {

    const { id } = req.params;
    const { ngo_id } = req.body;

    try {

        const result = await pool.query(
            `UPDATE donations
             SET status = 'claimed',
                 ngo_id = $1,
                 claimed_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [ngo_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Donation not found"
            });
        }

        res.json({
            success: true,
            message: "Claimed Successfully",
            donation: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


module.exports = router;