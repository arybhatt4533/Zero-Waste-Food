import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://zero-waste-food-b.onrender.com/auth/register', { name, email, password, role });
            alert("Signup Successful! Now please login.");
            navigate('/');
        } catch (err) {
            alert("Signup failed. User might already exist.");
        }
    };

    return (
        <div className="login-page">
            {/* Background Blobs for V2 Theme */}
            <div className="bg-circle circle1"></div>
            <div className="bg-circle circle2"></div>
            <div className="bg-circle circle3"></div>

            <div className="login-wrapper">

                {/* LEFT SECTION (Branding & Impact) */}
                <div className="login-left">
                    <div>
                        <div className="brand-badge">
                            🌱 Zero Waste Food
                        </div>
                        <h1>Join Us in <span>Saving Food</span> & Feeding Lives</h1>
                        <p>
                            Create your account and start saving food. Your one donation can help feed many people in need. Join us in our mission to reduce food waste.
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🍲</div>
                            <div>
                                <h3>Donate Extra Food</h3>
                                <p>Connect directly with local NGOs and community kitchens.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <div>
                                <h3>Make Real Impact</h3>
                                <p>Track how many meals you've saved and shared.</p>
                            </div>
                        </div>
                    </div>

                    <div className="left-bottom">
                        <div className="stat">
                            <h2>10K+</h2>
                            <span>Meals Saved</span>
                        </div>
                        <div className="stat">
                            <h2>500+</h2>
                            <span>Active Donors</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION (Signup Form) */}
                <div className="login-right" style={{ padding: '45px', display: 'flex', alignItems: 'center' }}>
                    <div className="login-card">
                        <div className="login-logo">
                            🍱
                        </div>
                        <h2>Create Account</h2>
                        <p className="subtitle">Fill in your details to get started</p>

                        <form onSubmit={handleSignup}>

                            {/* Full Name */}
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Address */}
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

                            {/* Password */}
                            <div className="input-group">
                                <label>Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "👁️" : "🙈"}
                                    </button>
                                </div>
                            </div>

                            {/* Role Select */}
                            <div className="input-group">
                                <label>Register As</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="donor">Donor (Restaurant/Individual)</option>
                                    <option value="ngo">NGO / Charitable Trust</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="login-btn" style={{ marginTop: '10px' }}>
                                Register
                            </button>

                            {/* Already Have Account */}
                            <div className="register">
                                Already have an account?{" "}
                                <span onClick={() => navigate('/')}>Login here</span>
                            </div>

                            <p className="copyright">
                                © 2026 Zero Waste Food. Together against food wastage.
                            </p>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Signup;