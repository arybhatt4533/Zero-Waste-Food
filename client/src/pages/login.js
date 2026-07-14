import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");

  const navigate = useNavigate();

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
        console.log(res.data); 

        // Token Save
        localStorage.setItem("token", res.data.token);

        // User Save
        localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
        );

        // Role Save
        localStorage.setItem(
            "role",
            res.data.user.role
        );

        // User ID Save
        localStorage.setItem(
            "user_id",
            res.data.user.id
        );

        alert("Login Successful ✅");

        if (res.data.user.role === "ngo") {
            navigate("/ngo-dashboard");
        } else {
            navigate("/donate");
        }

    } catch (err) {

        console.log(err);

        alert("Invalid Credentials!");

    }

};
  return (

    <div className="login-container">

      <div className="login-card">

        {/* LEFT SIDE */}

        <div className="login-left">

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVNY8aTtTjSIGmhVPxEm_pXHKZK-R-eD0aKT3jU5nyhA&s=10"
            alt="Food"
            className="food-image"
          />

          <div className="left-content">

            <h1>Zero Waste Food</h1>

            <p>
              Reduce Food Waste <br />
              Feed More People
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">

          <form
            className="login-box"
            onSubmit={handleLogin}
          >

            <h2>Login</h2>

            <select
              className="input-box"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="donor">
                Donor
              </option>

              <option value="ngo">
                NGO
              </option>

            </select>

            <input
              className="input-box"
              type="email"
              placeholder="Email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              required
            />

            <input
              className="input-box"
              type="password"
              placeholder="Password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              required
            />

            <button
              className="submit-btn"
              type="submit"
            >
              Sign In
            </button>

            <p className="footer-text">
              Don't have an account?

              <a href="/signup">
                {" "}
                Register for Free
              </a>

            </p>

          </form>

        </div>

      </div>

    </div>

  );
};

export default Login;