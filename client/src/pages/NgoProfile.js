import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NgoProfile.css";

const NgoProfile = () => {

    const [profile, setProfile] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(
                `https://zero-waste-food-b.onrender.com/ngo/profile/${user.id}`
            );

            console.log(res.data);

            setProfile(res.data.user);
            setOrders(res.data.orders);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    // सुरक्षित तरीके से फिल्टर करें
    const filteredOrders = Array.isArray(orders)
        ? orders.filter((order) =>
            order.food_name?.toLowerCase().includes(search.toLowerCase()) ||
            order.restaurant_name?.toLowerCase().includes(search.toLowerCase())
        )
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

    return (

        <div className="ngo-profile-page">

            {/* HERO */}

            <section className="profile-hero">

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
            <section className="profile-info">

                <div className="profile-avatar">

                    👤

                </div>

                <div className="profile-details">

                    <h2>{profile.name || "NGO Name"}</h2>

                    <p>📧 {profile.email}</p>

                    <p>📞 {profile.phone || "Not Available"}</p>

                    <p>📍 {profile.location || "India"}</p>

                </div>

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

            {/* CURRENT ORDERS */}

            <section className="current-orders">

                <h2>📦 Current Orders</h2>

                {

                    loading ?

                        <h3>Loading...</h3>

                        :

                        orders.length === 0 ?

                            <div className="empty">

                                <h3>No Orders Yet</h3>

                            </div>

                            :

                            orders.map(order => (

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

                                    <button>

                                        View Details

                                    </button>

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