import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor'); // 'donor' या 'ngo'
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // ध्यान दें: हमने सर्वर पर '/register' वाला रूट बनाया है
            await axios.post('http://localhost:5000/auth/register', { name, email, password, role });
            alert("Signup Successful! Now please login.");
            navigate('/'); // लॉगिन पेज पर भेजें
        } catch (err) {
            alert("Signup failed. User might already exist.");
        }
    };
    return (
        <div className="signup-container">

            <div className="signup-card">

                <div className="signup-left">

                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ11CAWx84xynMtOi83_G4rsE6hA_insxLk_ZR1YTKBqQ&s=10"
                        className="signup-image"
                        alt="food"
                    />

                    <h1>Zero Waste Food</h1>

                    <p>
                        Create your account and start saving food.
                    </p>

                </div>

                <div className="signup-right">

                    <form className="signup-box" onSubmit={handleSignup}>

                        <h2>Sign Up</h2>

                        <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <select onChange={(e) => setRole(e.target.value)}>

                            <option value="donor">Donor</option>

                            <option value="ngo">NGO</option>

                        </select>

                        <button type="submit">
                            Register
                        </button>

                        <p>
                            Already have an account?
                            <a href="/"> Login here</a>
                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Signup;