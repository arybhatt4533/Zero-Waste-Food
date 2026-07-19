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

        console.log("[DONATION] 1️⃣ Form submitted:", formData);

        if (formData.file && !validateFile(formData.file)) {
            return;
        }

        setIsLoading(true);

        try {

            const data = new FormData();

            data.append("foodName", formData.foodName);
            data.append("quantity", formData.quantity);
            data.append("restaurantName", formData.restaurantName);
            data.append("expiry", formData.expiry);
            data.append("location", formData.location);

            if (formData.file) {
                data.append("foodImage", formData.file);
            }

            // 👇 Logged-in donor id
            const user = JSON.parse(localStorage.getItem("user"));

            if (user && user.id) {
                data.append("user_id", user.id);
            }

            console.log("========= FormData =========");

            for (const pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.post(
                "http://localhost:5000/donations",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("✅ Donation Success:", response.data);

            alert("✅ Donation Posted Successfully!");

            setFormData({
                foodName: "",
                quantity: "",
                restaurantName: "",
                expiry: "",
                location: "",
                file: null
            });

            navigate("/ngo-dashboard");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Donation Failed"
            );

        } finally {

            setIsLoading(false);

        }
    };

    return (
        <div className="donation-page">
            <nav className="navbar">

                <div className="logo">
                     Zero Waste Food
                </div>

                <ul className="nav-links">

                    <li onClick={() => handleNavClick("hero")}>Home</li>

                    <li onClick={() => handleNavClick("donation-section")}>
                        Donate
                    </li>

                    <li onClick={() => handleNavClick("stats-section")}>
                        Statistics
                    </li>

                    <li onClick={() => handleNavClick("review-section")}>
                        Reviews
                    </li>

                    <li onClick={() => handleNavClick("footer")}>
                        Contact
                    </li>

                </ul>

                <button className="profile-btn">
                    My Profile
                </button>

            </nav>


            <section className="hero" id="hero">

                <div className="hero-bg">
                    <span className="blob blob1"></span>
                    <span className="blob blob2"></span>
                    <span className="blob blob3"></span>
                </div>

                <div className="hero-left">

                    <div className="hero-badge">
                        🌿 INDIA'S SMART FOOD DONATION PLATFORM
                    </div>

                    <h1>
                        Stop <span>Food Waste</span><br />
                        Start Saving <span>Lives</span>
                    </h1>

                    <p>
                        Join thousands of restaurants, NGOs and volunteers
                        who are reducing food waste while feeding hungry people.
                        One donation can change someone's day.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-btn"
                            onClick={() => handleNavClick("donation-section")}
                        >
                            ❤️ Donate Food
                        </button>

                        <button className="secondary-btn">
                            ▶ Watch Video
                        </button>

                    </div>

                    <div className="hero-stats">

                        <div className="hero-stat">
                            <h2>12K+</h2>
                            <span>Meals</span>
                        </div>

                        <div className="hero-stat">
                            <h2>320+</h2>
                            <span>NGOs</span>
                        </div>

                        <div className="hero-stat">
                            <h2>98%</h2>
                            <span>Success</span>
                        </div>

                    </div>

                </div>

                <div className="hero-right">

                    <div className="hero-image-wrapper">

                        <img
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900"
                            alt=""
                            className="hero-image"
                        />

                        <div className="floating-card card1">
                            🍱 Fresh Food
                        </div>

                        <div className="floating-card card2">
                            ❤️ NGO Connected
                        </div>

                        <div className="floating-card card3">
                            🚚 Pickup in 15 mins
                        </div>

                    </div>

                </div>

            </section>
            {/* ================= WHY DONATE ================= */}

            <section className="why-section" id="why">

                <div className="why-header">

                    <span className="why-tag">
                        🌿 WHY ZERO WASTE FOOD
                    </span>

                    <h2>
                        Every Donation Creates
                        <span> Real Impact</span>
                    </h2>

                    <p>
                        Zero Waste Food connects restaurants, volunteers and NGOs
                        through smart technology so that every extra meal reaches
                        someone who truly needs it.
                    </p>

                </div>

                <div className="why-container">

                    <div className="why-box">

                        <div className="why-icon">
                            ⚡
                        </div>

                        <h3>Instant Pickup</h3>

                        <p>
                            Nearby NGOs instantly receive your donation request
                            and collect fresh food within minutes.
                        </p>

                        <div className="why-number">
                            15 Min
                        </div>

                    </div>

                    <div className="why-box">

                        <div className="why-icon">
                            🍱
                        </div>

                        <h3>Fresh & Safe Food</h3>

                        <p>
                            Every donation is verified to ensure quality,
                            hygiene and freshness before delivery.
                        </p>

                        <div className="why-number">
                            100%
                        </div>

                    </div>

                    <div className="why-box">

                        <div className="why-icon">
                            ❤️
                        </div>

                        <h3>Feed Families</h3>

                        <p>
                            Your surplus food becomes hope for families,
                            children and homeless people across India.
                        </p>

                        <div className="why-number">
                            12K+
                        </div>

                    </div>

                    <div className="why-box">

                        <div className="why-icon">
                            🌍
                        </div>

                        <h3>Protect Nature</h3>

                        <p>
                            Reduce food waste, lower carbon emissions
                            and build a sustainable future together.
                        </p>

                        <div className="why-number">
                            850 KG
                        </div>

                    </div>

                </div>

            </section>

            <section className="donation-section" id="donation-section">

                <div className="donation-header">

                    <span>🍱 DONATE FOOD</span>

                    <h2>Donate Fresh Food</h2>

                    <p>
                        Fill the details below and our nearby NGO partner
                        will collect the food as soon as possible.
                    </p>

                </div>

                <div className="donation-card">

                    <form className="donation-form" onSubmit={handleDonate}>

                        <div className="input-group">
                            <label>🍔 Food Name</label>
                            <input
                                type="text"
                                placeholder="Enter food name"
                                value={formData.foodName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        foodName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>📦 Quantity</label>
                            <input
                                type="number"
                                placeholder="No. of Servings"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        quantity: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>🏪 Restaurant / Hotel</label>
                            <input
                                type="text"
                                placeholder="Restaurant Name"
                                value={formData.restaurantName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        restaurantName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>📍 Pickup Address</label>
                            <input
                                type="text"
                                placeholder="Complete Pickup Location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="input-group full">
                            <label>⏰ Food Expiry Time</label>

                            <input
                                type="datetime-local"
                                value={formData.expiry}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        expiry: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="upload-card full">

                            <div className="upload-icon">
                                📸
                            </div>

                            <h3>Upload Food Image</h3>

                            <p>
                                JPG, PNG • Maximum 5 MB
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        file: e.target.files[0],
                                    })
                                }
                            />

                            {formData.file && (
                                <div className="selected-file">
                                    ✅ {formData.file.name}
                                </div>
                            )}

                        </div>

                        <button
                            className="premium-donate-btn full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loader"></span>
                                    Posting Donation...
                                </>
                            ) : (
                                <>
                                    ❤️ Donate Food Now
                                </>
                            )}
                        </button>
                    </form>

                </div>

            </section>

            {/* ================= IMPACT SECTION ================= */}

            <section className="impact-area" id="stats-section">

                <div className="impact-title">

                    <span className="impact-badge">
                        🌿 OUR IMPACT
                    </span>

                    <h2>
                        Together We Are Building
                        <span> A Hunger Free India</span>
                    </h2>

                    <p>
                        Every meal donated creates hope for families,
                        reduces food waste and makes our environment cleaner.
                    </p>

                </div>

                <div className="impact-cards">

                    <div className="impact-card">

                        <div className="impact-top">

                            <div className="impact-icon">
                                🍽️
                            </div>

                            <h3>12,450+</h3>

                        </div>

                        <h4>Meals Donated</h4>

                        <p>
                            Fresh meals delivered safely to families across India.
                        </p>

                        <div className="impact-bar">

                            <span style={{ width: "95%" }}></span>

                        </div>

                    </div>


                    <div className="impact-card">

                        <div className="impact-top">

                            <div className="impact-icon">
                                ❤️
                            </div>

                            <h3>3,850+</h3>

                        </div>

                        <h4>Families Helped</h4>

                        <p>
                            Thousands of families received healthy food through donors.
                        </p>

                        <div className="impact-bar">

                            <span style={{ width: "88%" }}></span>

                        </div>

                    </div>


                    <div className="impact-card">

                        <div className="impact-top">

                            <div className="impact-icon">
                                🌍
                            </div>

                            <h3>28 Tons</h3>

                        </div>

                        <h4>Food Waste Saved</h4>

                        <p>
                            Prevented edible food from ending up in landfills.
                        </p>

                        <div className="impact-bar">

                            <span style={{ width: "82%" }}></span>

                        </div>

                    </div>


                    <div className="impact-card">

                        <div className="impact-top">

                            <div className="impact-icon">
                                🏆
                            </div>

                            <h3>500+</h3>

                        </div>

                        <h4>Active Donors</h4>

                        <p>
                            Restaurants, hotels and volunteers helping every day.
                        </p>

                        <div className="impact-bar">

                            <span style={{ width: "75%" }}></span>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= MOTIVATION ================= */}

            <section className="motivation">

                <div className="motivation-glow"></div>

                <h2>✨ Every Donation Creates Hope</h2>

                <p>
                    One meal may not change the whole world,
                    but it can change someone's world.
                    Your kindness transforms surplus food into
                    hope, smiles and a better tomorrow.
                </p>

                <div className="motivation-stats">

                    <div>
                        <h3>12K+</h3>
                        <span>Meals Shared</span>
                    </div>

                    <div>
                        <h3>3800+</h3>
                        <span>Families Helped</span>
                    </div>

                    <div>
                        <h3>500+</h3>
                        <span>Active Donors</span>
                    </div>

                </div>

            </section>


            {/* ================= REVIEWS ================= */}

            <section className="review-section" id="review-section">

                <div className="section-heading">
                    <span>TESTIMONIALS</span>
                    <h2>What Our Donors Say ❤️</h2>
                    <p>
                        Thousands of people are already helping us
                        reduce food waste and feed hungry families.
                    </p>
                </div>

                <div className="review-container">

                    <div className="review-card">

                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="review"
                        />

                        <h3>Aryabhatt</h3>

                        <h4>Regular Donor</h4>

                        <p>
                            "I donated food for the first time and
                            the process was incredibly simple.
                            Knowing that someone received a fresh
                            meal made my entire day."
                        </p>

                        <span>⭐⭐⭐⭐⭐</span>

                    </div>

                    <div className="review-card">

                        <img
                            src="https://i.pravatar.cc/150?img=33"
                            alt="review"
                        />

                        <h3>Priya Sharma</h3>

                        <h4>Restaurant Owner</h4>

                        <p>
                            "Earlier we used to throw away extra food.
                            Now every surplus meal reaches people who
                            actually need it. Amazing initiative."
                        </p>

                        <span>⭐⭐⭐⭐⭐</span>

                    </div>

                    <div className="review-card">

                        <img
                            src="https://i.pravatar.cc/150?img=56"
                            alt="review"
                        />

                        <h3>Rahul Verma</h3>

                        <h4>Volunteer</h4>

                        <p>
                            "Zero Waste Food helped us connect with
                            donors quickly. The platform is smooth,
                            fast and truly making an impact."
                        </p>

                        <span>⭐⭐⭐⭐⭐</span>

                    </div>

                </div>

            </section>

            {/* ================= PREMIUM FOOTER ================= */}

            <footer className="footer" id="footer">

                <div className="footer-top">

                    <div className="footer-brand">

                        <h2>
                            🌿 Zero Waste Food
                        </h2>

                        <p>
                            Together we can reduce food waste and make sure every extra meal
                            reaches someone who truly needs it.
                        </p>

                        <div className="footer-social">

                            <a
                                href="https://github.com/arybhatt4533"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="fab fa-github"></i>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/bhattarya4533/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="fab fa-linkedin"></i>
                            </a>

                            <a href="#">
                                <i className="fab fa-instagram"></i>
                            </a>

                            <a href="#">
                                <i className="fab fa-facebook"></i>
                            </a>

                        </div>

                    </div>

                    <div className="footer-links">

                        <h3>Quick Links</h3>

                        <a href="#hero">🏠 Home</a>
                        <a href="#donation-section">🍱 Donate Food</a>
                        <a href="#stats-section">📊 Statistics</a>
                        <a href="#review-section">⭐ Reviews</a>

                    </div>

                    <div className="footer-links">

                        <h3>Contact</h3>

                        <p>📍 Prayagraj, Uttar Pradesh</p>
                        <p>📞 +91 9517471194</p>
                        <p>📧 zerowastefood@gmail.com</p>

                    </div>

                    <div className="footer-links">

                        <h3>Our Mission</h3>

                        <p>🌍 Reduce Food Waste</p>
                        <p>🍱 Feed Hungry Families</p>
                        <p>🤝 Connect NGOs & Restaurants</p>
                        <p>❤️ Build Hunger Free India</p>

                    </div>

                </div>

                <div className="footer-bottom">

                    <div className="footer-line"></div>

                    <p>
                        © 2026 Zero Waste Food • Made with ❤️ by
                        <strong> Aryabhatt</strong>
                    </p>

                </div>

            </footer>
        </div>
    );
};

export default Donation;