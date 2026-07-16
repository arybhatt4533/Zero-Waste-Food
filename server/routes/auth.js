const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================
// REGISTER
// =====================================

router.post("/register", async (req, res) => {

    const { name, email, password, role } = req.body;

    try {

        const checkUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING user_id, name, email, role`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});


// =====================================
// LOGIN
// =====================================

router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND role = $2",
            [email, role]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Role"
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // 🌟 मुख्य बदलाव यहाँ है: टोकन के पेलोड में अब 'role' भी जा रहा है!
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role // 👈 ये लाइन डालना बेहद ज़रूरी था
            },
            process.env.JWT_SECRET || "mysecretkey", // 👈 .env फ़ाइल का सीक्रेट, या डिफ़ॉल्ट "mysecretkey"
            {
                expiresIn: "1h"
            }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;