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


module.exports = router;