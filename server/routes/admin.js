const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // पाथ अपने फोल्डर के हिसाब से चेक कर लेना

// एडमिन डैशबोर्ड प्रोटेक्टेड रूट
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
    try {
        // यहाँ आप अपना डैशबोर्ड डेटा भेज सकते हैं (जैसे अटैक्स लॉग्स, एक्टिविटी, आदि)
        res.status(200).json({
            success: true,
            message: "Welcome to the Admin Dashboard!",
            adminInfo: {
                id: req.user.id || req.user.admin_id,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

module.exports = router;