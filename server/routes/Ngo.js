const express = require("express");
const router = express.Router();
const pool = require("../db");

// NGO Profile + Claimed Orders
router.get("/profile/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const user = await pool.query(
            "SELECT user_id,name,email,role FROM users WHERE user_id=$1",
            [id]
        );

        const orders = await pool.query(
            `SELECT *
             FROM donations
             WHERE ngo_id=$1
             ORDER BY claimed_at DESC`,
            [id]
        );

        res.status(200).json({
            success: true,
            user: user.rows[0] || {},
            orders: orders.rows || []
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// Update editable NGO profile details
router.put("/profile/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE users
             SET name=$1, email=$2
             WHERE user_id=$3 AND role='ngo'
             RETURNING user_id, name, email, role`,
            [name.trim(), email.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found"
            });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update the pickup progress for a claimed donation
router.patch("/pickups/:id", async (req, res) => {
    const { id } = req.params;
    const { ngo_id, pickup_status } = req.body;
    const allowedStatuses = ["claimed", "preparing", "picked_up", "completed", "cancelled"];

    if (!ngo_id || !allowedStatuses.includes(pickup_status)) {
        return res.status(400).json({
            success: false,
            message: "Valid NGO ID and pickup status are required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE donations
             SET pickup_status=$1
             WHERE id=$2 AND ngo_id=$3
             RETURNING *`,
            [pickup_status, id, ngo_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pickup not found for this NGO"
            });
        }

        res.json({ success: true, donation: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});


module.exports = router;