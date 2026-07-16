const isAdmin = (req, res, next) => {
    console.log("Headers Authorization Received:", req.headers.authorization);
    console.log("Decoded User Payload:", req.user); // 👈 इससे सर्वर कंसोल में दिखेगा कि यूजर कौन है

    // सुरक्षा के साथ चेक करें कि क्या यूजर एडमिन है
    if (req.user) {
        // अगर पेलोड में admin_id है, या role 'admin' है, तो सीधे अनुमति दें
        if (req.user.admin_id || req.user.role === 'admin' || req.user.role === 'Admin') {
            return next();
        }
    }

    // अगर सब फेल हो जाए, तो कंसोल में रीज़न प्रिंट करें और ब्लॉक करें
    console.log("Blocked by isAdmin Middleware: Access Denied");
    return res.status(403).json({ message: "Access Denied: Admin privileges required" });
};

module.exports = isAdmin;