import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("donor");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "https://zero-waste-food-b.onrender.com/auth/login",
                {
                    email,
                    password,
                    role
                }
            );

            localStorage.setItem("token", res.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            localStorage.setItem(
                "role",
                res.data.user.role
            );

            localStorage.setItem(
                "user_id",
                res.data.user.id
            );

            if (remember) {
                localStorage.setItem("rememberEmail", email);
            }

            alert("✅ Login Successful");

            if (res.data.user.role === "ngo") {
                navigate("/ngo-dashboard");
            } else {
                navigate("/donate");
            }

        }

        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Invalid Credentials"
            );

        }

    };
    return (
        <div className="login-page">

            <div className="bg-circle circle1"></div>
            <div className="bg-circle circle2"></div>
            <div className="bg-circle circle3"></div>

            <div className="login-wrapper">

                {/* LEFT */}

                <div className="login-left">

                    <div className="brand-badge">
                        🌿 Zero Waste Food
                    </div>

                    <h1>
                        Save Food.
                        <br />
                        Feed Lives.
                    </h1>

                    <p>
                        Join India's smartest food donation platform.
                        Donate surplus food, reduce waste and help
                        thousands of families every day.
                    </p>

                    <div className="feature-grid">

                        <div className="feature-card">
                            <div className="feature-icon">🍱</div>
                            <div>
                                <h3>Fresh Food</h3>
                                <p>Donate hygienic meals</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">❤️</div>
                            <div>
                                <h3>Help Families</h3>
                                <p>Spread happiness</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <div>
                                <h3>Fast Pickup</h3>
                                <p>Nearby NGO collection</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <div>
                                <h3>Reduce Waste</h3>
                                <p>Protect our planet</p>
                            </div>
                        </div>

                    </div>

                    <div className="left-bottom">

                        <div className="stat">
                            <h2>12K+</h2>
                            <span>Meals Saved</span>
                        </div>

                        <div className="stat">
                            <h2>500+</h2>
                            <span>NGOs</span>
                        </div>

                        <div className="stat">
                            <h2>98%</h2>
                            <span>Success</span>
                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="login-right">

                    <form
                        className="login-card"
                        onSubmit={handleLogin}
                    >

                        <div className="login-logo">
                            🌿
                        </div>

                        <h2>Welcome Back</h2>

                        <p className="subtitle">
                            Login to continue
                        </p>

                        <div className="input-group">

                            <label>Login As</label>

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >

                                <option value="donor">
                                    👤 Donor
                                </option>

                                <option value="ngo">
                                    🏢 NGO
                                </option>

                            </select>

                        </div>

                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-wrapper">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>

                            </div>

                        </div>

                        <div className="login-options">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />

                                Remember Me

                            </label>

                            <a href="/">
                                Forgot Password?
                            </a>

                        </div>

                        <button
                            className="login-btn"
                            type="submit"
                        >
                            🚀 Login
                        </button>

                        <button
                            type="button"
                            className="admin-btn"
                            onClick={() => navigate("/admin-login")}
                        >
                            🔐 Admin Portal
                        </button>

                        <div className="register">

                            Don't have an account?

                            <span
                                onClick={() => navigate("/signup")}
                            >
                                Register Here
                            </span>

                        </div>

                        <div className="copyright">
                            © 2026 Zero Waste Food
                        </div>

                    </form>

                </div>

            </div>

        </div>
    );

};

export default Login;