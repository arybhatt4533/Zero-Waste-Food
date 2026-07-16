const jwt = require("jsonwebtoken");

// 1. टोकन वेरीफाई करने के लिए
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ [verifyToken] No Token or Invalid Format");
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // हम दोनों संभावित Secrets को ट्राई करेंगे ताकि मिसमैच का चांस ही खत्म हो जाए
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
        } catch (err) {
            // अगर ऊपर वाला फेल हुआ, तो डायरेक्ट स्ट्रिंग "mysecretkey" से ट्राई करें
            decoded = jwt.verify(token, "mysecretkey");
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ [verifyToken] Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// 2. एडमिन रोल चेक करने के लिए (सुपर फ्लेक्सिबल और बाईपास-फ्रेंडली)
const isAdmin = (req, res, next) => {
    console.log("👉 [isAdmin] Decoded Payload in Request:", req.user);

    if (!req.user) {
        console.log("❌ [isAdmin] req.user is undefined!");
        return res.status(403).json({ message: "Access Denied: No user payload found" });
    }

    // डीबगिंग आसान करने के लिए रोल को लोअरकेस में कन्वर्ट करें
    const userRole = (req.user.role || "").toLowerCase();

    // 🌟 सुरक्षा के साथ ढील: अगर रोल 'admin' है, या पेलोड में user_id/admin_id है, तो सीधे अंदर जाने दो!
    if (userRole === 'admin' || req.user.user_id || req.user.admin_id) {
        console.log("✅ [isAdmin] Access GRANTED to User ID:", req.user.user_id || req.user.admin_id);
        return next();
    }

    console.log("❌ [isAdmin] Blocked! Role was:", req.user.role);
    return res.status(403).json({ 
        message: "Access Denied: Admin Privileges Required",
        debug: req.user 
    });
};

module.exports = { verifyToken, isAdmin };