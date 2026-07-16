const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Header से Authorization टोकन निकालें (Format: Bearer <token>)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        // JWT_SECRET को आपके .env के अनुसार वेरीफाई करेगा
        const verified = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
        req.user = verified; // यूज़र का डेटा (id, role आदि) req.user में डाल दिया
        next(); // अगले स्टेप (isAdmin या Controller) पर भेजें
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;