import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({
        users: 0,
        ngos: 0,
        donations: 0,
        claimed: 0,
    });

    const [recentDonations, setRecentDonations] = useState([]);
    const [users, setUsers] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [donations, setDonations] = useState([]);

    // Helper function: Auth headers
    const getAuthConfig = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setLoading(false); // ✅ लॉगआउट होते समय लोडिंग बंद करें
        navigate("/admin-login");
    }, [navigate]);

    // fetchDashboard
    const fetchDashboard = useCallback(async () => {
        setLoading(true); // ✅ रिक्वेस्ट शुरू होने पर लोडिंग ऑन करें
        try {
            const res = await axios.get("http://localhost:5000/admin/dashboard", getAuthConfig());
            console.log("Admin Dashboard Data =>", res.data);

            if (res.data) {
                setStats(res.data.stats || { users: 0, ngos: 0, donations: 0, claimed: 0 });
                setRecentDonations(res.data.recentDonations || []);
                setUsers(res.data.users || []);
                setNgos(res.data.ngos || []);
                setDonations(res.data.donations || []);
            }
        } catch (err) {
            console.error("Fetch Dashboard Error:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("Session expired or Unauthorized. Please login again.");
                logout();
            } else {
                alert("Backend server is not responding or returned an error.");
            }
        } finally {
            setLoading(false); // ✅ हर हाल में लोडिंग को फॉल्स करें
        }
    }, [getAuthConfig, logout]);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setLoading(false); // ✅ टोकन न होने पर लोडिंग फॉल्स करें ताकि रीडायरेक्ट हो सके
            navigate("/admin-login");
            return;
        }
        fetchDashboard();
    }, [navigate, fetchDashboard]);

    // ============================
    // DELETE USER
    // ============================
    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/admin/users/${id}`, getAuthConfig());
            alert("User Deleted Successfully");
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Unable to delete user");
        }
    };

    // ============================
    // APPROVE NGO
    // ============================
    const approveNgo = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/ngos/${id}/approve`, {}, getAuthConfig());
            alert("NGO Approved");
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Unable to approve NGO");
        }
    };

    // ============================
    // REJECT NGO
    // ============================
    const rejectNgo = async (id) => {
        if (!window.confirm("Reject this NGO?")) return;
        try {
            await axios.put(`http://localhost:5000/admin/ngos/${id}/reject`, {}, getAuthConfig());
            alert("NGO Rejected");
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Unable to reject NGO");
        }
    };

    // ============================
    // DELETE DONATION
    // ============================
    const deleteDonation = async (id) => {
        if (!window.confirm("Delete this donation?")) return;
        try {
            await axios.delete(`http://localhost:5000/admin/donations/${id}`, getAuthConfig());
            alert("Donation Deleted");
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Unable to delete donation");
        }
    };

    // ============================
    // MARK DONATION COMPLETED
    // ============================
    const completeDonation = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/donations/${id}/complete`, {}, getAuthConfig());
            alert("Donation Completed");
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Unable to complete donation");
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <div className="loader"></div>
                <h2>Loading Admin Panel...</h2>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* ================= NAVBAR ================= */}
            <div className="admin-navbar">
                <h2>🌿 Zero Waste Food Admin Panel</h2>
                <div className="admin-user">
                    <span>👨‍💼 Super Admin</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            {/* ================= MENU ================= */}
            <div className="admin-menu">
                <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>
                <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>👥 Manage Users</button>
                <button className={activeTab === "ngos" ? "active" : ""} onClick={() => setActiveTab("ngos")}>❤️ Manage NGOs</button>
                <button className={activeTab === "donations" ? "active" : ""} onClick={() => setActiveTab("donations")}>🍱 Manage Donations</button>
            </div>

            {/* ================= DASHBOARD ================= */}
            {activeTab === "dashboard" && (
                <>
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

                    <div className="table-section">
                        <h2>Recent Donations</h2>
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
                                {recentDonations.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No recent donations found.</td></tr>
                                ) : (
                                    recentDonations.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.food_name}</td>
                                            <td>{item.restaurant_name}</td>
                                            <td>{item.ngo_name || "-"}</td>
                                            <td><span className="status">{item.status}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ================= USERS ================= */}
            {activeTab === "users" && (
                <div className="table-section">
                    <h2>Manage Users</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= NGOs ================= */}
            {activeTab === "ngos" && (
                <div className="table-section">
                    <h2>Manage NGOs</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ngos.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No NGOs found.</td></tr>
                            ) : (
                                ngos.map(ngo => (
                                    <tr key={ngo.id}>
                                        <td>{ngo.id}</td>
                                        <td>{ngo.name}</td>
                                        <td>{ngo.email}</td>
                                        <td>{ngo.status}</td>
                                        <td>
                                            <button className="approve-btn" onClick={() => approveNgo(ngo.id)}>Approve</button>
                                            <button className="delete-btn" onClick={() => rejectNgo(ngo.id)}>Reject</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= DONATIONS ================= */}
            {activeTab === "donations" && (
                <div className="table-section">
                    <h2>Manage Donations</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Restaurant</th>
                                <th>NGO</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No donations found.</td></tr>
                            ) : (
                                donations.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.food_name}</td>
                                        <td>{item.restaurant_name}</td>
                                        <td>{item.ngo_name || "-"}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button className="approve-btn" onClick={() => completeDonation(item.id)}>Complete</button>
                                            <button className="delete-btn" onClick={() => deleteDonation(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;