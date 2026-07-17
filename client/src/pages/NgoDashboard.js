import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NgoDashboard.css';
import { useNavigate } from "react-router-dom";

const NgoDashboard = () => {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/donations');
            // सिर्फ वो दिखाएं जिनका स्टेटस 'claimed' नहीं है
            setFoodList(res.data.filter(item => item.status !== 'claimed'));
            console.log('[NGO_DASHBOARD] ✅ Donations fetched:', res.data);
        } catch (err) {
            console.error('[NGO_DASHBOARD] ❌ Error fetching donations:', err);
            alert('Error fetching food donations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleClaim = async (id) => {
        console.log("Claim button clicked");
        console.log("Donation ID:", id);

        let ngo_id = localStorage.getItem("user_id");
        if (!ngo_id) {
            let ngo_id = localStorage.getItem("user_id");

            if (!ngo_id) {
                const storedUser = localStorage.getItem("user");

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);

                    ngo_id = parsedUser.id;  
                }
            }

            console.log("NGO ID =", ngo_id);
        }

        if (!id) {
            alert("Invalid Donation ID");
            return;
        }

        if (!ngo_id) {
            alert("NGO not logged in! (user_id missing in storage)");
            return;
        }

        try {
            const response = await axios.patch(
                `http://localhost:5000/donations/claim/${id}`,
                { ngo_id }
            );

            console.log("Server Response:", response.data);
            alert("🎉 Food Claimed Successfully!");
            await fetchDonations();
        } catch (error) {
            console.error("Claim Error:", error);
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
                alert(error.response.data.error || "Failed to claim food.");
            } else {
                alert("Server not responding.");
            }
        }
    };

    const getTimeRemaining = (expiryTime) => {
        const now = new Date();
        const expiry = new Date(expiryTime);
        const diff = expiry - now;

        if (diff < 0) return '⏰ Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours < 1) return `⏰ ${minutes}m left`;
        if (hours < 3) return `⏰ ${hours}h ${minutes}m left`;
        return `⏰ ${hours}h left`;
    };

    /* ===========================
       HERO IMAGE SLIDER
    =========================== */
    const heroImages = [
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200",
        "https://images.unsplash.com/photo-1469571486292-b53601020f35?w=1200",
        "https://images.unsplash.com/photo-1593113598332-cd59a93f7d7e?w=1200",
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200"
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="ngo-dashboard">
            {/* NAVBAR */}
            <nav className="ngo-navbar">
                <div className="ngo-logo">
                    🌿 <span>Zero Waste Food</span>
                </div>
                <div className="ngo-search">
                    <input
                        type="text"
                        placeholder="Search food, restaurant..."
                    />
                </div>
                <div className="ngo-nav-right">
                    <button className="notification-btn">🔔</button>
                    <button
                        className="profile-btn"
                        onClick={() => navigate("/ngo-profile")}
                    >
                        👤 My Profile
                    </button>
                </div>
            </nav>

            {/* PREMIUM HERO SECTION */}
            <section className="ngo-hero">
                <div className="hero-left">
                    <span className="hero-badge">
                        ❤️ Together We Fight Hunger
                    </span>
                    <h1>
                        Every Meal Saved
                        <br />
                        Creates A Smile
                    </h1>
                    <p className="hero-description">
                        Zero Waste Food is a community-driven platform that connects
                        restaurants, hotels, event organizers and generous donors
                        with verified NGOs. Instead of letting perfectly edible food
                        go to waste, we help deliver it safely to families and
                        individuals who truly need it.
                    </p>
                    <p className="hero-description">
                        Every donation is tracked from pickup to distribution,
                        ensuring transparency, food safety and maximum social impact.
                        Together we are reducing food waste, protecting the
                        environment and creating a hunger-free future.
                    </p>
                    <div className="hero-buttons">
                        <button className="primary-btn">🍱 Browse Donations</button>
                        <button className="secondary-btn">❤️ Learn More</button>
                    </div>
                    <div className="hero-stats">
                        <div>
                            <h2>12,540+</h2>
                            <span>Meals Saved</span>
                        </div>
                        <div>
                            <h2>326+</h2>
                            <span>Restaurants</span>
                        </div>
                        <div>
                            <h2>68+</h2>
                            <span>Partner NGOs</span>
                        </div>
                        <div>
                            <h2>95%</h2>
                            <span>Pickup Success</span>
                        </div>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="hero-slider">
                        <img
                            src={heroImages[currentImage]}
                            alt="Helping People"
                            className="slider-image"
                        />
                        <div className="slider-dots">
                            {heroImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={currentImage === index ? "dot active-dot" : "dot"}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DASHBOARD SUMMARY */}
            <section className="summary-section">
                <div className="summary-card">
                    <h4>🍱 Available Food</h4>
                    <h2>{foodList.length}</h2>
                    <span>Live Donations</span>
                </div>
                <div className="summary-card">
                    <h4>❤️ Meals Saved</h4>
                    <h2>2,450</h2>
                    <span>Today</span>
                </div>
                <div className="summary-card">
                    <h4>🚚 Active Pickups</h4>
                    <h2>18</h2>
                    <span>In Progress</span>
                </div>
                <div className="summary-card">
                    <h4>🌍 Waste Reduced</h4>
                    <h2>380 KG</h2>
                    <span>This Month</span>
                </div>
            </section>

            {/* SEARCH & FILTER */}
            <section className="search-filter-section">
                <div className="search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by food, restaurant or location..."
                    />
                </div>
                <div className="filter-buttons">
                    <button className="active">All</button>
                    <button>🍛 Veg</button>
                    <button>🍗 Non-Veg</button>
                    <button>🥛 Dairy</button>
                    <button>🥖 Bakery</button>
                    <button>🍎 Fruits</button>
                    <button>⏰ Expiring Soon</button>
                </div>
            </section>

            {/* FILTER BAR */}
            <section className="filter-section">
                <button className="active">All</button>
                <button>Veg</button>
                <button>Non-Veg</button>
                <button>Near Me</button>
                <button>Expiring Soon</button>
            </section>

            {/* DONATION GRID */}
            <section className="food-grid">
                {loading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <h2>Loading Donations...</h2>
                    </div>
                ) : foodList.length === 0 ? (
                    <div className="empty-state">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                            alt="No Food"
                        />
                        <h2>No Food Donations Available</h2>
                        <p>
                            There are currently no available donations.
                            Please check again later.
                        </p>
                    </div>
                ) : (
                    foodList.map((item) => {
                        console.log("Donation Item =>", item);
                        return (
                            <div className="food-card" key={item.id}>
                                {/* Food Image */}
                                <div className="food-image">
                                    <img
                                        src={
                                            item.image_url
                                                ? `http://localhost:5000${item.image_url}`
                                                : "https://images.unsplash.com/photo-1547592180-85f173990554?w=800"
                                        }
                                        alt={item.food_name}
                                    />
                                    <span className="food-status">🟢 Available</span>
                                </div>

                                {/* Food Content */}
                                <div className="food-content">
                                    <h2>{item.food_name}</h2>
                                    <p>🏪 {item.restaurant_name}</p>
                                    <p>📦 {item.quantity} Servings</p>
                                    <p>📍 {item.location}</p>
                                    <p className="expiry">
                                        {getTimeRemaining(item.expiry_time)}
                                    </p>
                                    <div className="pickup-time">
                                        <span>🚚 Pickup ETA</span>
                                        <span>20-30 min</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="claim-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log("🔥 Claim Button Clicked");
                                            console.log("Donation ID :", item.id);
                                            console.log("Donation :", item);
                                            handleClaim(item.id);
                                        }}
                                    >
                                        ❤️ Claim Food
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/*====================================
        LIVE ANALYTICS
=====================================*/}

            <section className="analytics-section">

                <div className="analytics-header">

                    <h2>📊 Live Analytics</h2>

                    <p>
                        Real-time impact of your NGO's contribution towards reducing food waste.
                    </p>

                </div>

                <div className="analytics-grid">

                    <div className="analytics-card">
                        <div className="analytics-icon">🍱</div>
                        <h3>Today's Donations</h3>
                        <h1>128</h1>

                        <div className="progress-bar">
                            <div className="progress progress1"></div>
                        </div>

                        <span>+18% from yesterday</span>
                    </div>

                    <div className="analytics-card">
                        <div className="analytics-icon">❤️</div>
                        <h3>Meals Served</h3>
                        <h1>2,450</h1>

                        <div className="progress-bar">
                            <div className="progress progress2"></div>
                        </div>

                        <span>Excellent Growth</span>
                    </div>

                    <div className="analytics-card">
                        <div className="analytics-icon">🌍</div>
                        <h3>Food Waste Saved</h3>
                        <h1>380 KG</h1>

                        <div className="progress-bar">
                            <div className="progress progress3"></div>
                        </div>

                        <span>Helping Environment</span>
                    </div>

                    <div className="analytics-card">
                        <div className="analytics-icon">🚚</div>
                        <h3>Active Pickups</h3>
                        <h1>24</h1>

                        <div className="progress-bar">
                            <div className="progress progress4"></div>
                        </div>

                        <span>8 Vehicles Active</span>
                    </div>

                </div>

            </section>

            {/*====================================
        RECENT ACTIVITY
=====================================*/}

            <section className="activity-section">

                <div className="section-heading">

                    <h2>📈 Recent Activity</h2>

                    <p>
                        Stay updated with every pickup, donation and distribution happening in real time.
                    </p>

                </div>

                <div className="activity-timeline">

                    <div className="activity-card">

                        <div className="activity-icon">🍱</div>

                        <div className="activity-content">

                            <h3>New Food Donation Received</h3>

                            <p>City Restaurant donated 35 fresh meals for distribution.</p>

                            <span>2 Minutes Ago</span>

                        </div>

                    </div>

                    <div className="activity-card">

                        <div className="activity-icon">🚚</div>

                        <div className="activity-content">

                            <h3>Pickup Assigned</h3>

                            <p>Your volunteer Rahul accepted the pickup request.</p>

                            <span>12 Minutes Ago</span>

                        </div>

                    </div>

                    <div className="activity-card">

                        <div className="activity-icon">❤️</div>

                        <div className="activity-content">

                            <h3>Meals Delivered</h3>

                            <p>120 meals successfully distributed to nearby shelters.</p>

                            <span>1 Hour Ago</span>

                        </div>

                    </div>

                    <div className="activity-card">

                        <div className="activity-icon">🌍</div>

                        <div className="activity-content">

                            <h3>Environment Impact</h3>

                            <p>42 KG food waste prevented from reaching landfill.</p>

                            <span>Today</span>

                        </div>

                    </div>

                </div>

            </section>
            {/*====================================
        TOP PARTNER NGOs
=====================================*/}

            <section className="top-ngo-section">

                <div className="section-heading">

                    <h2>🏆 Top Partner NGOs</h2>

                    <p>
                        Trusted organizations making the biggest impact by delivering fresh food
                        to people in need across different cities.
                    </p>

                </div>

                <div className="top-ngo-grid">

                    <div className="top-ngo-card gold">

                        <div className="ngo-rank">🥇</div>

                        <img
                            src="https://i.pravatar.cc/180?img=31"
                            alt=""
                        />

                        <h3>Smile Foundation</h3>

                        <span className="verified">
                            ✔ Verified NGO
                        </span>

                        <p>
                            📍 Prayagraj
                        </p>

                        <div className="ngo-stats">

                            <div>
                                <h4>2,340</h4>
                                <span>Meals</span>
                            </div>

                            <div>
                                <h4>4.9⭐</h4>
                                <span>Rating</span>
                            </div>

                            <div>
                                <h4>125</h4>
                                <span>Pickups</span>
                            </div>

                        </div>

                        <button>
                            View Profile
                        </button>

                    </div>

                    <div className="top-ngo-card">

                        <div className="ngo-rank">🥈</div>

                        <img
                            src="https://i.pravatar.cc/180?img=41"
                            alt=""
                        />

                        <h3>Helping Hands</h3>

                        <span className="verified">
                            ✔ Verified NGO
                        </span>

                        <p>
                            📍 Lucknow
                        </p>

                        <div className="ngo-stats">

                            <div>
                                <h4>1,920</h4>
                                <span>Meals</span>
                            </div>

                            <div>
                                <h4>4.8⭐</h4>
                                <span>Rating</span>
                            </div>

                            <div>
                                <h4>104</h4>
                                <span>Pickups</span>
                            </div>

                        </div>

                        <button>
                            View Profile
                        </button>

                    </div>

                    <div className="top-ngo-card">

                        <div className="ngo-rank">🥉</div>

                        <img
                            src="https://i.pravatar.cc/180?img=56"
                            alt=""
                        />

                        <h3>Food Bank India</h3>

                        <span className="verified">
                            ✔ Verified NGO
                        </span>

                        <p>
                            📍 Kanpur
                        </p>

                        <div className="ngo-stats">

                            <div>
                                <h4>3,540</h4>
                                <span>Meals</span>
                            </div>

                            <div>
                                <h4>5.0⭐</h4>
                                <span>Rating</span>
                            </div>

                            <div>
                                <h4>180</h4>
                                <span>Pickups</span>
                            </div>

                        </div>

                        <button>
                            View Profile
                        </button>

                    </div>

                </div>

            </section>

            {/* ===========================
            NGO TIPS
    ============================ */}

            <section className="tips-section">

                <h2>💡 NGO Best Practices</h2>

                <div className="tips-grid">

                    <div className="tip-card">
                        ⏰
                        <h3>Quick Pickup</h3>
                        <p>Collect food as soon as possible to maintain freshness.</p>
                    </div>

                    <div className="tip-card">
                        ❤️
                        <h3>Food Safety</h3>
                        <p>Always verify expiry time before distribution.</p>
                    </div>

                    <div className="tip-card">
                        🌍
                        <h3>Reduce Waste</h3>
                        <p>Every claimed donation helps protect our environment.</p>
                    </div>

                </div>

            </section>
            {/*====================================
        IMPACT DASHBOARD
=====================================*/}

            <section className="impact-section">

                <div className="impact-left">

                    <span className="impact-tag">
                        🌍 Live Community Impact
                    </span>

                    <h2>
                        Together We Are Building
                        <br />
                        A Hunger-Free Future
                    </h2>

                    <p>
                        Every donation collected through Zero Waste Food is tracked in real-time.
                        Restaurants, NGOs and volunteers work together to ensure that perfectly
                        good food reaches people instead of landfills.
                    </p>

                    <div className="impact-buttons">

                        <button>
                            🍱 Explore Donations
                        </button>

                        <button className="outline">

                            📈 View Report

                        </button>

                    </div>

                </div>



                <div className="impact-right">

                    <div className="impact-box">

                        <h3>❤️ Meals Served</h3>

                        <h1>12,480+</h1>

                    </div>

                    <div className="impact-box">

                        <h3>🌍 Food Saved</h3>

                        <h1>8.6 Tons</h1>

                    </div>

                    <div className="impact-box">

                        <h3>🏢 Restaurants</h3>

                        <h1>420+</h1>

                    </div>

                    <div className="impact-box">

                        <h3>🤝 NGOs</h3>

                        <h1>82</h1>

                    </div>

                </div>

            </section>

            {/*====================================
        LIVE DONATION FEED
=====================================*/}

            <section className="live-feed-section">

                <div className="section-heading">

                    <h2>🔴 Live Donation Feed</h2>

                    <p>
                        Real-time donations received from restaurants across different cities.
                    </p>

                </div>

                <div className="feed-wrapper">

                    <div className="feed-track">

                        <div className="feed-card">
                            <div className="feed-icon">🍱</div>
                            <div>
                                <h3>Fresh Biryani</h3>
                                <p>City Restaurant • Prayagraj</p>
                            </div>
                            <span>2 min ago</span>
                        </div>

                        <div className="feed-card">
                            <div className="feed-icon">🥗</div>
                            <div>
                                <h3>Veg Meals</h3>
                                <p>Hotel Royal • Lucknow</p>
                            </div>
                            <span>5 min ago</span>
                        </div>

                        <div className="feed-card">
                            <div className="feed-icon">🍛</div>
                            <div>
                                <h3>Rice & Curry</h3>
                                <p>Food Plaza • Kanpur</p>
                            </div>
                            <span>8 min ago</span>
                        </div>

                        <div className="feed-card">
                            <div className="feed-icon">🍕</div>
                            <div>
                                <h3>Pizza Combo</h3>
                                <p>Domino's • Delhi</p>
                            </div>
                            <span>10 min ago</span>
                        </div>

                        <div className="feed-card">
                            <div className="feed-icon">🥪</div>
                            <div>
                                <h3>Sandwich Pack</h3>
                                <p>Cafe House • Noida</p>
                            </div>
                            <span>12 min ago</span>
                        </div>

                    </div>

                </div>

            </section>

            {/*====================================
        NGO MOTIVATION
=====================================*/}

            <section className="ngo-motivation">

                <div className="motivation-card">

                    <span className="motivation-tag">
                        ❤️ Keep Making a Difference
                    </span>

                    <h2>
                        Together We Can End Hunger
                    </h2>

                    <p>
                        Every food donation you collect becomes hope for a family in need.
                        Your dedication helps reduce food waste, protect the environment,
                        and create thousands of smiles every single day.
                    </p>

                    <div className="motivation-stats">

                        <div>
                            <h3>12K+</h3>
                            <span>Meals Served</span>
                        </div>

                        <div>
                            <h3>350+</h3>
                            <span>Restaurants</span>
                        </div>

                        <div>
                            <h3>80+</h3>
                            <span>NGO Partners</span>
                        </div>

                    </div>

                    <button className="motivation-btn">
                        🌿 Continue Helping
                    </button>

                </div>

            </section>
            {/*====================================
        ACHIEVEMENTS
=====================================*/}

            <section className="achievement-section">

                <div className="section-heading">

                    <h2>🏆 Achievements & Rewards</h2>

                    <p>
                        Your contribution is creating real impact. Unlock new badges as you
                        continue helping people and reducing food waste.
                    </p>

                </div>

                <div className="achievement-grid">

                    <div className="achievement-card gold">

                        <div className="badge-icon">🥇</div>

                        <h3>Food Hero</h3>

                        <p>
                            Successfully completed
                            <strong> 100+ pickups</strong>
                        </p>

                        <span>Unlocked</span>

                    </div>

                    <div className="achievement-card">

                        <div className="badge-icon">❤️</div>

                        <h3>Helping Hand</h3>

                        <p>
                            Distributed over
                            <strong> 500 meals</strong>
                        </p>

                        <span>Unlocked</span>

                    </div>

                    <div className="achievement-card">

                        <div className="badge-icon">🌍</div>

                        <h3>Eco Warrior</h3>

                        <p>
                            Reduced
                            <strong> 1 Ton Food Waste</strong>
                        </p>

                        <span>Unlocked</span>

                    </div>

                    <div className="achievement-card locked">

                        <div className="badge-icon">👑</div>

                        <h3>Legend Donor</h3>

                        <p>
                            Complete
                            <strong> 1000 Donations</strong>
                        </p>

                        <span>Locked</span>

                    </div>

                </div>

            </section>
            {/*====================================
        ANALYTICS OVERVIEW
=====================================*/}

            <section className="analytics-overview">

                <div className="section-heading">

                    <h2>📊 Donation Analytics</h2>

                    <p>
                        Track your impact with real-time statistics and performance insights.
                    </p>

                </div>

                <div className="analytics-grid">

                    <div className="chart-card">

                        <h3>Monthly Donations</h3>

                        <div className="bar-chart">

                            <div className="bar" style={{ height: "45%" }}><span>Jan</span></div>
                            <div className="bar" style={{ height: "60%" }}><span>Feb</span></div>
                            <div className="bar" style={{ height: "75%" }}><span>Mar</span></div>
                            <div className="bar" style={{ height: "55%" }}><span>Apr</span></div>
                            <div className="bar active" style={{ height: "90%" }}><span>May</span></div>
                            <div className="bar" style={{ height: "80%" }}><span>Jun</span></div>

                        </div>

                    </div>

                    <div className="chart-card">

                        <h3>Distribution Progress</h3>

                        <div className="progress-list">

                            <div className="progress-item">

                                <span>Meals Delivered</span>

                                <div className="progress">
                                    <div className="progress-fill" style={{ width: "92%" }}></div>
                                </div>

                            </div>

                            <div className="progress-item">

                                <span>Food Saved</span>

                                <div className="progress">
                                    <div className="progress-fill" style={{ width: "85%" }}></div>
                                </div>

                            </div>

                            <div className="progress-item">

                                <span>Pickup Success</span>

                                <div className="progress">
                                    <div className="progress-fill" style={{ width: "97%" }}></div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
            {/*====================================
        DONATION MAP
=====================================*/}

            <section className="map-section">

                <div className="section-heading">

                    <h2>🗺️ Nearby Donation Network</h2>

                    <p>
                        Live donation locations and NGO pickup coverage across your city.
                    </p>

                </div>

                <div className="map-container">

                    <div className="map-left">

                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400"
                            alt="Map"
                        />

                        <div className="map-marker marker1">📍</div>
                        <div className="map-marker marker2">❤️</div>
                        <div className="map-marker marker3">🍱</div>
                        <div className="map-marker marker4">🚚</div>

                    </div>

                    <div className="map-right">

                        <div className="location-card">

                            <h3>📍 Nearby Donations</h3>

                            <span>15 Active</span>

                        </div>

                        <div className="location-card">

                            <h3>❤️ Partner NGOs</h3>

                            <span>8 Available</span>

                        </div>

                        <div className="location-card">

                            <h3>🚚 Pickup Vehicles</h3>

                            <span>5 Running</span>

                        </div>

                        <div className="location-card">

                            <h3>⏰ Expiring Soon</h3>

                            <span>4 Donations</span>

                        </div>

                    </div>

                </div>

            </section>

            {/*====================================
        FOOTER
=====================================*/}

            <footer className="ngo-footer">

                <div className="footer-grid">

                    {/* About */}

                    <div className="footer-box">

                        <h2>🌿 Zero Waste Food</h2>

                        <p>
                            We connect restaurants, NGOs and volunteers
                            to reduce food waste and provide fresh meals
                            to people who need them most.
                        </p>

                    </div>


                    {/* Quick Links */}

                    <div className="footer-box">

                        <h3>Quick Links</h3>

                        <a href="/">🏠 Home</a>

                        <a href="/donation">🍱 Donate Food</a>

                        <a href="/ngo-dashboard">❤️ Dashboard</a>

                        <a href="/about">📖 About</a>

                    </div>


                    {/* Contact */}

                    <div className="footer-box">

                        <h3>Contact</h3>

                        <p>📍 Prayagraj, Uttar Pradesh</p>

                        <p>📞 +91 9517471194</p>

                        <p>✉️ bhattarya4533@gmail.com</p>

                    </div>


                    {/* Social */}

                    <div className="footer-box">

                        <h3>Follow Me</h3>

                        <a
                            href="https://github.com/arybhatt4533"
                            target="_blank"
                            rel="noreferrer"
                        >
                            💻 GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/bhattarya4533/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            💼 LinkedIn
                        </a>

                    </div>

                </div>


                {/* Newsletter */}

                <div className="newsletter">

                    <div>

                        <h2>📩 Stay Updated</h2>

                        <p>
                            Get updates about new food donations and NGO activities.
                        </p>

                    </div>

                    <div className="newsletter-box">

                        <input
                            type="email"
                            placeholder="Enter your email"
                        />

                        <button>

                            Subscribe

                        </button>

                    </div>

                </div>


                <div className="footer-bottom">

                    <p>

                        © 2026 Zero Waste Food | Made with ❤️ by
                        <strong> Aryabhatt</strong>

                    </p>

                </div>

            </footer>
        </div >

    );

};

export default NgoDashboard;