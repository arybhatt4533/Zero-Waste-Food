import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "https://zero-waste-food-b.onrender.com/admin/login",
                {
                    email,
                    password
                }
            );

            console.log(res.data);

            localStorage.setItem(
                "adminToken",
                res.data.token
            );

            localStorage.setItem(
                "admin",
                JSON.stringify(res.data.admin)
            );

            alert("✅ Admin Login Successful");

            navigate("/admin-dashboard");

        } catch (err) {

            console.log(err.response?.data);

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="admin-login-page">

            {/* Left Section */}

            <div className="admin-left">

                <div className="overlay"></div>

                <div className="left-content">

                    <span className="badge">
                        🔒 Secure Admin Portal
                    </span>

                    <h1>

                        Zero Waste Food

                        <br />

                        <span>Administration Panel</span>

                    </h1>

                    <p>

                        Manage Restaurants, NGOs, Users,
                        Donations and monitor everything
                        from one secure dashboard.

                    </p>

                    <div className="feature-list">

                        <div className="feature">
                            📊 Live Analytics Dashboard
                        </div>

                        <div className="feature">
                            🍱 Donation Monitoring
                        </div>

                        <div className="feature">
                            🏢 NGO Verification
                        </div>

                        <div className="feature">
                            👥 User Management
                        </div>

                        <div className="feature">
                            📈 Reports & Statistics
                        </div>

                    </div>

                </div>

            </div>

            {/* Right Section */}

            <div className="admin-right">

                <form
                    className="admin-login-box"
                    onSubmit={handleLogin}
                >

                    <div className="login-logo">
                        🌿
                    </div>

                    <h2>Welcome Back</h2>

                    <p>
                        Login to continue to the
                        Admin Dashboard
                    </p>

                    <div className="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login to Dashboard →
                    </button>

                    <div className="security-box">
                        🔐 Authorized Administrators Only
                    </div>

                    <div className="login-footer">
                        © 2026 Zero Waste Food
                        <br />
                        Admin Control Center
                    </div>

                </form>

            </div>

        </div>

    );

};

export default AdminLogin;