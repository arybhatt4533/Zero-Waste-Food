console.log("✅ Admin Routes Loaded");

const express = require("express");
const router = express.Router();

const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==============================
// TEST ROUTE
// ==============================

router.get("/test", (req, res) => {
    res.send("✅ Admin Route Working");
});


// ==============================
// ADMIN LOGIN
// ==============================

router.post("/login", async (req, res) => {

    console.log("➡️ POST /admin/login");

    const { email, password } = req.body;

    console.log(email);

    try {

        const result = await pool.query(
            "SELECT * FROM admins WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });

        }

        const admin = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(

            {
                admin_id: admin.admin_id,
                email: admin.email
            },

            process.env.JWT_SECRET || "mysecretkey",

            {
                expiresIn: "2h"
            }

        );

        res.json({

            success: true,

            message: "Login Successful",

            token,

            admin: {

                id: admin.admin_id,
                name: admin.name,
                email: admin.email

            }

        });

    }

    catch (err) {

        console.log("LOGIN ERROR");
        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});


// ==============================
// ADMIN DASHBOARD
// ==============================

router.get("/dashboard", async (req, res) => {

    try {

        const users = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        const ngos = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role='ngo'
        `);

        const donations = await pool.query(`
            SELECT COUNT(*) AS total
            FROM donations
        `);

        const claimed = await pool.query(`
            SELECT COUNT(*) AS total
            FROM donations
            WHERE ngo_id IS NOT NULL
        `);

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

                claimed: Number(claimed.rows[0].total)

            },

            recentDonations: recent.rows

        });

    }

    catch (err) {

        console.log("Dashboard Error");
        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

module.exports = router;