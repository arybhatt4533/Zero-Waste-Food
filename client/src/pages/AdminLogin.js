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
                "http://localhost:5000/admin/login",
                {
                    email,
                    password
                }
            );

            console.log(res.data);

            localStorage.setItem("adminToken", res.data.token);

            localStorage.setItem(
                "admin",
                JSON.stringify(res.data.admin)
            );

            alert("✅ Admin Login Successful");

            navigate("/admin-dashboard");

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message || "Login Failed"
            );

        }

    };

    return (

        <div className="admin-login">

            <form
                className="admin-login-box"
                onSubmit={handleLogin}
            >

                <h1>Admin Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">

                    Login

                </button>

            </form>

        </div>

    );

};

export default AdminLogin;