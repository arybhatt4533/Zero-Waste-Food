import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Donation.css";

const Donation = () => {
    const [formData, setFormData] = useState({
        foodName: '', quantity: '', restaurantName: '', expiry: '', location: '', file: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ File validation function
    const validateFile = (file) => {
        if (!file) {
            console.warn("[FILE] No file selected - this is optional");
            return true;
        }

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file.size > MAX_SIZE) {
            console.error("[FILE] ❌ File too large:", file.size);
            alert("File size must be less than 5MB");
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            console.error("[FILE] ❌ Invalid file type:", file.type);
            alert("Only JPG and PNG images are allowed");
            return false;
        }

        console.log("[FILE] ✅ File validated:", file.name, file.size, file.type);
        return true;
    };

    const handleNavClick = (sectionId) => {
        console.log(`[NAV] 🔍 Clicking: ${sectionId}`);
        const element = document.getElementById(sectionId);

        if (element) {
            // ✅ OPTIMIZED: Native scrollIntoView respects scroll-margin-top in CSS
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log(`[NAV] ✅ Successfully scrolled to ${sectionId}`);
        } else {
            console.error(`[NAV] ❌ Element with ID "${sectionId}" NOT FOUND in DOM`);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        console.log("[DONATION] 1️⃣ Form submitted with data:", formData);

        // ✅ Validate file if provided
        if (formData.file && !validateFile(formData.file)) {
            console.error("[DONATION] ❌ File validation failed");
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append('foodName', formData.foodName);
        data.append('quantity', formData.quantity);
        data.append('restaurantName', formData.restaurantName);
        data.append('expiry', formData.expiry);
        data.append('location', formData.location);
        data.append('foodImage', formData.file); // Can be null, that's fine

        // ✅ DEBUG: Log FormData contents
        console.log("[DONATION] 2️⃣ FormData contents:");
        for (let pair of data.entries()) {
            console.log(`  📋 ${pair[0]}: ${pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].size} bytes)` : pair[1]}`);
        }

        try {
            console.log("[DONATION] 3️⃣ Sending POST request to http://localhost:5000/donations");
            const response = await axios.post('http://localhost:5000/donations', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("[DONATION] 4️⃣ ✅ SUCCESS! Server response:", response.data);
            alert("✅ Donation posted successfully!");

            // ✅ CRITICAL FIX: Reset form data
            setFormData({ foodName: '', quantity: '', restaurantName: '', expiry: '', location: '', file: null });
            console.log("[DONATION] 5️⃣ Form data cleared");

            // Navigate after brief delay for UX
            setTimeout(() => navigate('/ngo-dashboard'), 500);

        } catch (err) {
            console.error("[DONATION] 4️⃣ ❌ ERROR DETAILS:");
            console.error("  Response Status:", err.response?.status);
            console.error("  Error Message:", err.response?.data?.message || err.message);
            console.error("  Server Data:", err.response?.data);
            console.error("  Full Error Object:", err);

            // ✅ IMPROVED ERROR HANDLING: Show actual error message
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Unknown error occurred";

            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
            console.log("[DONATION] Request completed - Loading state cleared");
        }
    };

    return (
        <div className="donation-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">🌿 Zero Waste Food</div>
                <ul className="nav-links">
                    <li onClick={() => handleNavClick('hero')}>Home</li>
                    <li onClick={() => handleNavClick('donation-section')}>Donate</li>
                    <li onClick={() => handleNavClick('review-section')}>History</li>
                    <li onClick={() => handleNavClick('stats-section')}>About</li>
                    <li onClick={() => handleNavClick('footer')}>Contact</li>
                </ul>
                <button className="profile-btn">My Profile</button>
            </nav> 
            

            {/* Hero Section */}
            <section className="hero" id="hero">
                <div className="hero-left">
                    <span className="tag">🌿 Save Food • Save Lives</span>
                    <h1>Donate Food,<br /> Spread Happiness ❤️</h1>
                    <p>Your extra food can become someone's next meal. Join Zero Waste Food and help reduce hunger while protecting our environment.</p>
                    <button className="hero-btn" onClick={() => handleNavClick('donation-section')}>Donate Now</button>
                </div>
                <div className="hero-right">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeEJ5AxElHJigVxVNVJHI-yL6Ex9GQ5pFFunMKsuTG-g&s=10" alt="Donate Food" className="hero-image" />
                </div>
            </section>
            {/* ================= WHY DONATE ================= */}

            <section className="why-donate">

                <div className="section-heading">
                    <span>WHY CHOOSE US</span>
                    <h2>Why Donate Through Zero Waste Food?</h2>
                    <p>
                        We connect restaurants, families and NGOs through a fast,
                        transparent and trusted food donation platform.
                    </p>
                </div>

                <div className="why-grid">

                    <div className="why-card">
                        <div className="why-icon">⚡</div>
                        <h3>Instant Pickup</h3>
                        <p>
                            Nearby NGOs receive your request immediately and collect food
                            within the shortest possible time.
                        </p>
                    </div>

                    <div className="why-card">
                        <div className="why-icon">🍱</div>
                        <h3>Fresh Food</h3>
                        <p>
                            Only fresh and safe food is accepted so every meal reaches
                            people in perfect condition.
                        </p>
                    </div>

                    <div className="why-card">
                        <div className="why-icon">❤️</div>
                        <h3>Help Families</h3>
                        <p>
                            Every donation supports hungry families and brings smiles to
                            people who truly need it.
                        </p>
                    </div>

                    <div className="why-card">
                        <div className="why-icon">🌍</div>
                        <h3>Reduce Waste</h3>
                        <p>
                            Together we reduce food waste, protect nature and build a more
                            sustainable future.
                        </p>
                    </div>

                </div>

            </section>

            <section className="donation-section" id="donation-section">
                <div className="donation-card">
                    <div className="card-header">
                        <h2>🍱 Donate Fresh Food</h2>
                        <p>Fill the details below to help NGOs collect your food.</p>
                    </div>

                    <form className="donation-form" onSubmit={handleDonate}>
                        {[
                            { name: "foodName", type: "text", placeholder: "🍔 Food Name" },
                            { name: "quantity", type: "number", placeholder: "📦 Quantity (in servings)" },
                            { name: "restaurantName", type: "text", placeholder: "🏪 Restaurant Name" },
                            { name: "location", type: "text", placeholder: "📍 Pickup Location" }
                        ].map((field) => (
                            <input
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                required
                            />
                        ))}

                        <input
                            type="datetime-local"
                            name="expiry"
                            id="expiry"
                            value={formData.expiry}
                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                            required
                        />

                        <div className="file-input-container">
                            <label htmlFor="foodImage">Upload Food Photo:</label>
                            <input
                                type="file"
                                id="foodImage"
                                name="foodImage"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                            />
                        </div>

                        <button className="donate-btn" type="submit" disabled={isLoading}>
                            {isLoading ? "⏳ Submitting..." : "❤️ Donate Food"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Statistics */}
            <section className="stats-section" id="stats-section">
                <div className="stat-card"><h2>🍽</h2><h3>1,245</h3><p>Meals Saved</p></div>
                <div className="stat-card"><h2>❤️</h2><h3>420</h3><p>Families Helped</p></div>
                <div className="stat-card"><h2>🌍</h2><h3>850 KG</h3><p>Food Waste Reduced</p></div>
                <div className="stat-card"><h2>🏆</h2><h3>Food Hero</h3><p>Keep Donating</p></div>
            </section>

            {/* Motivation */}
            <section className="motivation">
                <h2>✨ Every Donation Creates Hope</h2>
                <p>
                    "One meal may not change the whole world, but it can change someone's world.
                    Your kindness turns surplus food into hope, smiles, and a better tomorrow."
                </p>
            </section>

            {/* Reviews */}
            <section className="review-section" id="review-section">
                <h2 className="section-title">❤️ What Our Donors Say</h2>
                <div className="review-container">
                    <div className="review-card">
                        <img src="https://i.pravatar.cc/100?img=12" alt="" />
                        <h3>Aryabhatt</h3>
                        <h4>Regular Donor</h4>
                        <p>"I donated food for the first time and the process was super easy. It feels amazing knowing someone received a fresh meal."</p>
                        <span>⭐⭐⭐⭐⭐</span>
                    </div>
                    {/* Add other reviews here */}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="footer">

                <div className="footer-container">

                    <div className="footer-box">
                        <h2>🌿 Zero Waste Food</h2>
                        <p>
                            Every meal donated creates hope.
                            Join us in reducing food waste and feeding people in need.
                        </p>
                    </div>

                    <div className="footer-box">
                        <h3>Quick Links</h3>

                        <a href="#hero">🏠 Home</a>
                        <a href="#donation-section">🍱 Donate</a>
                        <a href="#stats-section">📊 Statistics</a>
                        <a href="#review-section">🌟 Reviews</a>
                    </div>

                    <div className="footer-box">
                        <h3>Contact</h3>

                        <p>📍 Prayagraj, Uttar Pradesh</p>
                        <p>📞 +91 9517471194</p>

                        <a
                            href="https://www.linkedin.com/in/bhattarya4533/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            💼 LinkedIn Profile
                        </a>

                        <a
                            href="https://github.com/arybhatt4533"
                            target="_blank"
                            rel="noreferrer"
                        >
                            💻 GitHub Profile
                        </a>

                    </div>

                    <div className="footer-box">
                        <h3>Our Mission</h3>

                        <p>🌍 Reduce Food Waste</p>
                        <p>❤️ Feed Hungry People</p>
                        <p>🤝 Connect NGOs & Restaurants</p>
                        <p>♻ Build a Sustainable Future</p>
                    </div>

                </div>

                <div className="copyright">
                    © 2026 Zero Waste Food | Made with ❤️ for a Hunger-Free India
                </div>

            </footer>
        </div>
    );
};

export default Donation;