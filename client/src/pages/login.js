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
                "http://localhost:5000/auth/login",
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

        <div className="login-container">

            <div className="login-card">

                {/* LEFT */}

                <div className="login-left">

                    <div className="left-content">

                        <div className="badge">
                            🌿 Zero Waste Food
                        </div>

                        <h1>

                            Every Meal Saved

                            <br />

                            <span>
                                Creates A Smile ❤️
                            </span>

                        </h1>

                        <p>

                            Zero Waste Food connects restaurants,
                            hotels and generous donors with verified
                            NGOs to reduce food waste and feed
                            people in need.

                        </p>

                        <div className="features">

                            <div className="feature">
                                🍱 Donate Extra Food
                            </div>

                            <div className="feature">
                                🏢 Verified NGOs
                            </div>

                            <div className="feature">
                                🚚 Fast Pickup
                            </div>

                            <div className="feature">
                                📍 Live Donation Tracking
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="login-right">

                    <form
                        className="login-box"
                        onSubmit={handleLogin}
                    >

                        <div className="login-logo">
                            🌿
                        </div>

                        <h2>
                            Welcome Back
                        </h2>

                        <p className="login-subtitle">
                            Login to continue
                        </p>

                        <select
                            className="input-box"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >

                            <option value="donor">
                                👤 Donor
                            </option>

                            <option value="ngo">
                                🏢 NGO
                            </option>

                        </select>

                        <input

                            className="input-box"

                            type="email"

                            placeholder="Email Address"

                            value={email}

                            onChange={(e) =>
                                setEmail(e.target.value)
                            }

                            required

                        />

                        <div className="password-box">

                            <input

                                className="input-box"

                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Password"

                                value={password}

                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }

                                required

                            />

                            <button

                                type="button"

                                className="show-btn"

                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }

                            >

                                {
                                    showPassword
                                        ? "🙈"
                                        : "👁"
                                }

                            </button>

                        </div>

                        <div className="login-options">

                            <label>

                                <input

                                    type="checkbox"

                                    checked={remember}

                                    onChange={(e) =>
                                        setRemember(
                                            e.target.checked
                                        )
                                    }

                                />

                                Remember Me

                            </label>

                            <a href="/">
                                Forgot Password?
                            </a>

                        </div>

                        <button

                            className="submit-btn"

                            type="submit"

                        >

                            🚀 Login

                        </button>

                        <button

                            type="button"

                            className="admin-btn"

                            onClick={() =>
                                navigate("/admin-login")
                            }

                        >

                            🔐 Admin Portal

                        </button>

                        <p className="footer-text">

                            Don't have an account?

                            <span
                                onClick={() =>
                                    navigate("/signup")
                                }
                            >

                                Register Here

                            </span>

                        </p>

                        <div className="copyright">

                            © 2026 Zero Waste Food

                            <br />

                            Saving Food • Saving Lives ❤️

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};

export default Login;