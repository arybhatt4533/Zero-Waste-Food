const express = require("express");
const router = express.Router();
const pool = require("../db"); // db.js का पाथ
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ==========================================
// 1. POST /admin/login (सुपर-बायपास एडमिन लॉगिन)
// ==========================================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("👉 Admin Login Attempt for:", email);

        if (email.toLowerCase() === 'admin@gmail.com') {
            console.log("👑 Super-Bypass Active for admin@gmail.com");

            const token = jwt.sign(
                {
                    user_id: 9999, 
                    role: 'admin'
                },
                process.env.JWT_SECRET || "mysecretkey",
                { expiresIn: "1d" }
            );

            return res.json({
                success: true,
                message: "Admin Login Successful (Bypassed)",
                token,
                user: {
                    id: 9999,
                    name: "System Admin",
                    email: "admin@gmail.com",
                    role: "admin"
                }
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: Email not registered."
            });
        }

        const user = result.rows[0];

        if (user.role !== 'admin' && user.role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: "Access Denied: You are not authorized as an Admin."
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET || "mysecretkey",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Admin Login Successful",
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("❌ Admin Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
});

// ==========================================
// 2. GET /admin/dashboard (Fixed NGO Query)
// ==========================================
router.get("/dashboard", verifyToken, isAdmin, async (req, res) => {
    try {
        console.log("👉 Fetching REAL Admin Dashboard Data...");

        // 1. Users Count (Admins ko chhod kar)
        const usersCount = await pool.query(
            "SELECT COUNT(*) FROM users WHERE LOWER(role) != 'admin'"
        );

        // 2. Direct Users Table se NGOs fetch karo (Taaki Empty Table Fallback issue na aaye)
        const allNGOsFromUsers = await pool.query(
            "SELECT user_id as id, name, email, status FROM users WHERE LOWER(role) = 'ngo' ORDER BY user_id DESC"
        );
        
        let allNGOsRows = allNGOsFromUsers.rows;
        let ngosCountVal = allNGOsFromUsers.rows.length;

        // 3. Donations Data
        let donationsCountVal = 0;
        let claimedCountVal = 0;
        let recentDonationsRows = [];
        let allDonationsRows = [];

        try {
            const totalDonations = await pool.query("SELECT COUNT(*) FROM donations");
            donationsCountVal = parseInt(totalDonations.rows[0].count) || 0;

            const claimedDonations = await pool.query(
                "SELECT COUNT(*) FROM donations WHERE LOWER(status) = 'completed' OR LOWER(status) = 'claimed' OR claimed_at IS NOT NULL"
            );
            claimedCountVal = parseInt(claimedDonations.rows[0].count) || 0;

            const recentDonations = await pool.query(`
                SELECT d.id, d.food_name, d.status, u.name as restaurant_name 
                FROM donations d
                LEFT JOIN users u ON d.user_id = u.user_id
                ORDER BY d.id DESC LIMIT 5
            `);
            recentDonationsRows = recentDonations.rows;

            const allDonations = await pool.query(`
                SELECT d.id, d.food_name, d.status, u.name as restaurant_name 
                FROM donations d
                LEFT JOIN users u ON d.user_id = u.user_id
                ORDER BY d.id DESC
            `);
            allDonationsRows = allDonations.rows;

        } catch (dbErr) {
            console.error("⚠️ Donations Table Error:", dbErr.message);
        }

        // 4. All Users (Except Admin)
        const allUsers = await pool.query(
            "SELECT user_id as id, name, email, role, status FROM users WHERE LOWER(role) != 'admin' ORDER BY user_id DESC"
        );

        res.status(200).json({
            success: true,
            stats: {
                users: parseInt(usersCount.rows[0].count) || 0,
                ngos: ngosCountVal,
                donations: donationsCountVal,
                claimed: claimedCountVal
            },
            recentDonations: recentDonationsRows,
            users: allUsers.rows,
            ngos: allNGOsRows,
            donations: allDonationsRows
        });

    } catch (err) {
        console.error("❌ Dashboard DB Error:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
});

// ==========================================
// 3. DELETE /admin/users/:id
// ==========================================
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
        res.json({ success: true, message: "User Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 4. PUT /admin/ngos/:id/approve
// ==========================================
router.put("/ngos/:id/approve", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // पहले ngos टेबल में अपडेट करने की कोशिश करें, अगर वहां नहीं है तो users टेबल में status बदलें
        try {
            await pool.query("UPDATE ngos SET status = 'Approved' WHERE id = $1", [id]);
        } catch (err) {
            await pool.query("UPDATE users SET status = 'Approved' WHERE user_id = $1", [id]);
        }
        res.json({ success: true, message: "NGO Approved Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 5. PUT /admin/ngos/:id/reject
// ==========================================
router.put("/ngos/:id/reject", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        try {
            await pool.query("UPDATE ngos SET status = 'Rejected' WHERE id = $1", [id]);
        } catch (err) {
            await pool.query("UPDATE users SET status = 'Rejected' WHERE user_id = $1", [id]);
        }
        res.json({ success: true, message: "NGO Rejected Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 6. PUT /admin/donations/:id/complete
// ==========================================
router.put("/donations/:id/complete", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE donations SET status = 'Completed' WHERE id = $1", [id]);
        res.json({ success: true, message: "Donation Marked as Completed" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 7. DELETE /admin/donations/:id
// ==========================================
router.delete("/donations/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM donations WHERE id = $1", [id]);
        res.json({ success: true, message: "Donation Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;