const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
// routes/auth.js में लॉगिन रूट
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body; // 'role' यहाँ से लें
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1 AND role = $2", [email, role]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials or role" });
        }
        
        // ... बाकी का पासवर्ड चेक करने वाला कोड वही रहेगा
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ user_id: user.rows[0].id }, 'mysecretkey', { expiresIn: '1h' });
        res.json({ token, role: user.rows[0].role, user_id: user.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        // JWT टोकन बनाना
        const token = jwt.sign({ user_id: user.rows[0].id }, 'mysecretkey', { expiresIn: '1h' });

        // यहाँ से 'role' भी भेज रहे हैं ताकि फ्रंटएंड फैसला कर सके
        res.json({ 
            message: "Login successful!", 
            token, 
            user_id: user.rows[0].id, 
            role: user.rows[0].role 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;