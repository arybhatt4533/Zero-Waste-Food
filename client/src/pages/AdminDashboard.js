import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        users: 0,
        ngos: 0,
        donations: 0,
        claimed: 0,
    });

    const [recentDonations, setRecentDonations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {

            const res = await axios.get(
                "http://localhost:5000/admin/dashboard"
            );

            setStats(res.data.stats);
            setRecentDonations(res.data.recentDonations);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("admin");
        navigate("/admin-login");
    };

    return (

        <div className="admin-dashboard">

            {/* Navbar */}

            <div className="admin-navbar">

                <h2>🌿 Zero Waste Food Admin</h2>

                <div className="admin-user">

                    <span>👨‍💼 Super Admin</span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </div>

            {/* Cards */}

            <div className="dashboard-cards">

                <div className="card blue">
                    <h3>Total Users</h3>
                    <h1>{stats.users}</h1>
                </div>

                <div className="card green">
                    <h3>Total NGOs</h3>
                    <h1>{stats.ngos}</h1>
                </div>

                <div className="card orange">
                    <h3>Total Donations</h3>
                    <h1>{stats.donations}</h1>
                </div>

                <div className="card red">
                    <h3>Claimed Donations</h3>
                    <h1>{stats.claimed}</h1>
                </div>

            </div>

            {/* Recent Donations */}

            <div className="table-section">

                <h2>Recent Donations</h2>

                {
                    loading ?

                        <h3>Loading...</h3>

                        :

                        <table>

                            <thead>

                                <tr>
                                    <th>Food</th>
                                    <th>Restaurant</th>
                                    <th>NGO</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {
                                    recentDonations.length === 0 ?

                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{ textAlign: "center" }}
                                            >
                                                No Donations Found
                                            </td>
                                        </tr>

                                        :

                                        recentDonations.map((item) => (

                                            <tr key={item.id}>

                                                <td>{item.food_name}</td>

                                                <td>{item.restaurant_name}</td>

                                                <td>
                                                    {item.ngo_name || "-"}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            item.status === "completed"
                                                                ? "status completed"
                                                                : item.status === "claimed"
                                                                    ? "status claimed"
                                                                    : "status pending"
                                                        }
                                                    >
                                                        {item.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))
                                }

                            </tbody>

                        </table>

                }

            </div>

        </div>

    );

};

export default AdminDashboard;