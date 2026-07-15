const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    try {

        // Find Admin
        const result = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });

        }

        const admin = result.rows[0];

        // Verify Password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }

        // Create JWT Token
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

        // Success Response
        return res.status(200).json({

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

        console.error("Admin Login Error:", err);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

module.exports = {
    adminLogin
};