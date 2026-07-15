console.log("✅ Admin Routes Loaded");

const express = require("express");
const router = express.Router();
const pool = require("../db");

// ==============================
// Admin Dashboard
// ==============================

router.get("/dashboard", async (req, res) => {
    try {

        // Total Users
        const users = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        // Total NGOs
        const ngos = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'ngo'
        `);

        // Total Donations
        const donations = await pool.query(`
            SELECT COUNT(*) AS total
            FROM donations
        `);

        // Claimed Donations
        const claimed = await pool.query(`
            SELECT COUNT(*) AS total
            FROM donations
            WHERE ngo_id IS NOT NULL
        `);

        // Recent Donations
        const recent = await pool.query(`
            SELECT
                d.id,
                d.food_name,
                d.quantity,
                d.restaurant_name,
                d.location,
                d.status,
                d.claimed_at,
                u.name AS ngo_name
            FROM donations d
            LEFT JOIN users u
                ON d.ngo_id = u.user_id
            ORDER BY d.id DESC
            LIMIT 10
        `);

        res.json({
            stats: {
                users: Number(users.rows[0].total),
                ngos: Number(ngos.rows[0].total),
                donations: Number(donations.rows[0].total),
                claimed: Number(claimed.rows[0].total),
            },
            recentDonations: recent.rows
        });

    } catch (err) {
        console.error("Admin Dashboard Error:", err);

        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;