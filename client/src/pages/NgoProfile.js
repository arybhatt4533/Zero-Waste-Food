import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NgoProfile.css";
import logoImage from "../assets/zwf.png";

const API_BASE = "https://zero-waste-food-b.onrender.com";

const NgoProfile = () => {

    const [profile, setProfile] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", email: "" });
    const [statusFilter, setStatusFilter] = useState("all");
    const [historyFallbackImages, setHistoryFallbackImages] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(`${API_BASE}/Ngo/profile/${user.id}`);

            console.log(res.data);

            setProfile(res.data.user);
            setOrders(res.data.orders);
            setProfileForm({
                name: res.data.user.name || "",
                email: res.data.user.email || ""
            });

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        navigate("/login");
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        setSavingProfile(true);

        try {
            const res = await axios.put(`${API_BASE}/Ngo/profile/${user.id}`, profileForm);
            setProfile(res.data.user);
            localStorage.setItem("user", JSON.stringify({ ...user, ...res.data.user, id: user.id }));
            setEditingProfile(false);
            alert("Profile updated successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const updatePickupStatus = async (orderId, pickupStatus) => {
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            const res = await axios.patch(`${API_BASE}/Ngo/pickups/${orderId}`, {
                ngo_id: user.id,
                pickup_status: pickupStatus
            });
            setOrders((currentOrders) => currentOrders.map((order) =>
                order.id === orderId ? res.data.donation : order
            ));
        } catch (error) {
            alert(error.response?.data?.message || "Unable to update pickup status");
        }
    };

    const defaultFoodImage = "https://images.unsplash.com/photo-1547592180-85f173990554?w=800";

    const handleHistoryImageError = (id) => {
        setHistoryFallbackImages((previous) => ({ ...previous, [id]: true }));
    };

    // सुरक्षित तरीके से फिल्टर करें
    const filteredOrders = Array.isArray(orders)
        ? orders.filter((order) =>
            order.food_name?.toLowerCase().includes(search.toLowerCase()) ||
            order.restaurant_name?.toLowerCase().includes(search.toLowerCase())
        ).filter((order) => statusFilter === "all" || order.pickup_status === statusFilter)
        : []; // अगर orders ऐरे नहीं है, तो खाली ऐरे दे दें

    const completed = Array.isArray(orders)
        ? orders.filter(item => item.pickup_status === "completed").length
        : 0;

    const pending = Array.isArray(orders)
        ? orders.filter(item => item.pickup_status !== "completed").length
        : 0;

    const meals = Array.isArray(orders)
        ? orders.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
        : 0;

    const completedMeals = Array.isArray(orders)
        ? orders
            .filter(item => item.pickup_status === "completed")
            .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
        : 0;

    const activeOrders = Array.isArray(orders)
        ? orders.filter(order => !["completed", "cancelled"].includes(order.pickup_status))
        : [];

    const notifications = Array.isArray(orders)
        ? orders.slice(0, 3).map((order) => ({
            id: order.id,
            title: order.pickup_status === "completed" ? "Pickup completed" : "Pickup requires attention",
            message: `${order.food_name} from ${order.restaurant_name}`,
            status: order.pickup_status
        }))
        : [];

    return (

        <div className="ngo-profile-page">

            {/* HERO */}

            <section className="profile-hero">

                <div className="profile-brand" aria-label="Zero Waste Food">
                    <img src={logoImage} alt="Zero Waste Food" />
                </div>

                <div>

                    <h1>👤 NGO Profile</h1>

                    <p>
                        Welcome back,
                        <strong>
                            {" "}
                            {profile.name || "NGO"}
                        </strong>
                    </p>

                </div>

            </section>

            <div className="profile-warning-ticker" role="status" aria-label="NGO food access notice">
                <div className="profile-warning-track">
                    <div className="profile-warning-copy">
                        <span>⚠ Food donations are reserved for verified NGOs</span>
                        <b>✦</b>
                        <span>Claim food only for community distribution</span>
                        <b>✦</b>
                    </div>
                    <div className="profile-warning-copy" aria-hidden="true">
                        <span>⚠ Food donations are reserved for verified NGOs</span>
                        <b>✦</b>
                        <span>Claim food only for community distribution</span>
                        <b>✦</b>
                    </div>
                </div>
            </div>

            <section className="profile-info">

                <div className="profile-avatar">

                    👤

                </div>

                <div className="profile-details">

                    {editingProfile ? (
                        <form className="profile-edit-form" onSubmit={handleProfileSave}>
                            <label>
                                NGO Name
                                <input
                                    value={profileForm.name}
                                    onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                                    required
                                />
                            </label>
                            <div className="profile-edit-actions">
                                <button type="submit" disabled={savingProfile}>
                                    {savingProfile ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" onClick={() => setEditingProfile(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2>{profile.name || "NGO Name"}</h2>
                            <p>📧 {profile.email}</p>
                            <p>📞 {profile.phone || "Not Available"}</p>
                            <p>📍 {profile.location || "India"}</p>
                        </>
                    )}

                </div>

                {!editingProfile && (
                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={() => setEditingProfile(true)}
                    >
                        Edit Profile
                    </button>
                )}

                <button
                    type="button"
                    className="profile-logout"
                    onClick={handleLogout}
                >
                    ↪ Logout
                </button>

            </section>

            {/* STATS */}

            <section className="profile-stats">

                <div className="stat-card">

                    <h2>{Array.isArray(orders) ? orders.length : 0}</h2>

                    <span>Total Claims</span>

                </div>

                <div className="stat-card">

                    <h2>{completed}</h2>

                    <span>Completed</span>

                </div>

                <div className="stat-card">

                    <h2>{pending}</h2>

                    <span>Pending</span>

                </div>

                <div className="stat-card">

                    <h2>{meals}</h2>

                    <span>Meals Saved</span>

                </div>

            </section>

            <section className="impact-section">
                <div>
                    <span>Meals completed</span>
                    <strong>{completedMeals}</strong>
                </div>
                <div>
                    <span>Active pickups</span>
                    <strong>{activeOrders.length}</strong>
                </div>
                <div>
                    <span>Food saved</span>
                    <strong>{meals} servings</strong>
                </div>
            </section>

            {/* CURRENT ORDERS */}

            <section className="current-orders">

                <h2>📦 Current Orders</h2>

                {

                    loading ?

                        <h3>Loading...</h3>

                        :

                        activeOrders.length === 0 ?

                            <div className="empty">

                                <h3>No Orders Yet</h3>

                            </div>

                            :

                            activeOrders.map(order => (

                                <div
                                    className="order-card"
                                    key={order.id}
                                >

                                    <h3>{order.food_name}</h3>

                                    <p>
                                        🏪 {order.restaurant_name}
                                    </p>

                                    <p>
                                        📦 {order.quantity} Servings
                                    </p>

                                    <p>
                                        📍 {order.location}
                                    </p>

                                    <p>

                                        Status :

                                        <b>

                                            {" "}

                                            {order.pickup_status}

                                        </b>

                                    </p>

                                    <select
                                        value={order.pickup_status || "claimed"}
                                        onChange={(event) => updatePickupStatus(order.id, event.target.value)}
                                        aria-label={`Update pickup status for ${order.food_name}`}
                                    >
                                        <option value="claimed">Claimed</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="picked_up">Picked Up</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                </div>

                            ))

                }

            </section>
            <section className="history-header">

                <h2>📜 Order History</h2>

                <input
                    type="text"
                    placeholder="Search Food or Restaurant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter claims by status"
                >
                    <option value="all">All statuses</option>
                    <option value="claimed">Claimed</option>
                    <option value="preparing">Preparing</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

            </section>
            <section className="history-list">

                {
                    filteredOrders.length === 0 ?

                        <h3>No Orders Found</h3>

                        :

                        filteredOrders.map((order) => (

                            <div
                                className="history-card"
                                key={order.id}
                            >

                                <div className="history-image-wrapper">
                                    <img
                                        className="history-image"
                                        src={order.image_url && !historyFallbackImages[order.id]
                                            ? `${API_BASE}${order.image_url}`
                                            : defaultFoodImage}
                                        alt={order.food_name || "Food donation"}
                                        onError={() => handleHistoryImageError(order.id)}
                                    />
                                    {(!order.image_url || historyFallbackImages[order.id]) && (
                                        <span className="history-image-message">
                                            Real picture not available
                                        </span>
                                    )}
                                </div>

                                <div>

                                    <h3>{order.food_name}</h3>

                                    <p>{order.restaurant_name}</p>

                                    <p>{order.quantity} Servings</p>

                                    <p>

                                        Claimed :

                                        {" "}

                                        {order.claimed_at
                                            ? new Date(order.claimed_at).toLocaleString()
                                            : "N/A"}

                                    </p>

                                </div>

                                <div className="status-box">

                                    <span>

                                        {order.pickup_status}

                                    </span>

                                    <button
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >

                                        View

                                    </button>

                                </div>

                            </div>

                        ))

                }

            </section>
            <section className="notifications-section">
                <div className="section-title-row">
                    <h2>🔔 Notifications</h2>
                    <span>{notifications.length} recent</span>
                </div>
                {notifications.length === 0 ? (
                    <p className="notifications-empty">No pickup notifications yet.</p>
                ) : (
                    notifications.map((notification) => (
                        <div className="notification-item" key={notification.id}>
                            <strong>{notification.title}</strong>
                            <span>{notification.message}</span>
                            <small>{notification.status}</small>
                        </div>
                    ))
                )}
            </section>

            <section className="timeline">

                <h2>

                    🚚 Current Order Timeline

                </h2>

                <div className="timeline-box">

                    <div className="step active">

                        ✅ Claimed

                    </div>

                    <div className="line"></div>

                    <div className="step">

                        🍱 Preparing

                    </div>

                    <div className="line"></div>

                    <div className="step">

                        🚚 Picked Up

                    </div>

                    <div className="line"></div>

                    <div className="step">

                        🏠 Delivered

                    </div>

                </div>

            </section>

        </div>

    );

};

export default NgoProfile;