const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// ADMIN LOGIN
// ======================================================

const adminLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    try {

        const result = await pool.query(
            "SELECT * FROM admins WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                admin_id: admin.admin_id,
                email: admin.email
            },
            process.env.JWT_SECRET || "mysecretkey",
            {
                expiresIn: "2h"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            admin: {
                id: admin.admin_id,
                name: admin.name,
                email: admin.email
            }
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getDashboard = async (req, res) => {

    try {

        const users = await pool.query(
            "SELECT user_id,name,email,role FROM users ORDER BY user_id DESC"
        );

        const ngos = await pool.query(
            "SELECT user_id,name,email,role FROM users WHERE role='ngo' ORDER BY user_id DESC"
        );

        const donations = await pool.query(`
            SELECT
                d.*,
                u.name AS ngo_name
            FROM donations d
            LEFT JOIN users u
            ON d.ngo_id=u.user_id
            ORDER BY d.id DESC
        `);

        const stats = {

            users: users.rows.length,

            ngos: ngos.rows.length,

            donations: donations.rows.length,

            claimed: donations.rows.filter(

                item =>
                    item.status === "claimed" ||
                    item.status === "completed"

            ).length

        };

        res.status(200).json({

            stats,

            users: users.rows,

            ngos: ngos.rows,

            donations: donations.rows,

            recentDonations: donations.rows.slice(0,10)

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Dashboard Error"
        });

    }

};

// ======================================================
// GET USERS
// ======================================================

const getUsers = async(req,res)=>{

    try{

        const result=await pool.query(`
            SELECT
            user_id,
            name,
            email,
            role
            FROM users
            ORDER BY user_id DESC
        `);

        res.status(200).json(result.rows);

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Unable to fetch users"
        });

    }

};

// ======================================================
// DELETE USER
// ======================================================

const deleteUser = async(req,res)=>{

    try{

        const {id}=req.params;

        await pool.query(

            "DELETE FROM users WHERE user_id=$1",

            [id]

        );

        res.status(200).json({

            success:true,

            message:"User Deleted Successfully"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:"Unable to delete user"

        });

    }

};

// ======================================================
// BLOCK USER
// ======================================================

const blockUser = async(req,res)=>{

    try{

        const {id}=req.params;

        await pool.query(

            "UPDATE users SET status='blocked' WHERE user_id=$1",

            [id]

        );

        res.status(200).json({

            success:true,

            message:"User Blocked Successfully"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:"Unable to block user"

        });

    }

};

// ======================================================
// GET ALL NGOs
// ======================================================

const getNGOs = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                user_id,
                name,
                email,
                role
            FROM users
            WHERE role='ngo'
            ORDER BY user_id DESC
        `);

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch NGOs"
        });

    }

};

// ======================================================
// APPROVE NGO
// ======================================================

const approveNGO = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "UPDATE users SET status='approved' WHERE user_id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "NGO Approved Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to approve NGO"
        });

    }

};

// ======================================================
// REJECT NGO
// ======================================================

const rejectNGO = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "UPDATE users SET status='rejected' WHERE user_id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "NGO Rejected Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to reject NGO"
        });

    }

};

// ======================================================
// DELETE NGO
// ======================================================

const deleteNGO = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM users WHERE user_id=$1 AND role='ngo'",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "NGO Deleted Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to delete NGO"
        });

    }

};

// ======================================================
// GET DONATIONS
// ======================================================

const getDonations = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                d.*,
                u.name AS ngo_name
            FROM donations d
            LEFT JOIN users u
            ON d.ngo_id = u.user_id
            ORDER BY d.id DESC
        `);

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch donations"
        });

    }

};

// ======================================================
// APPROVE DONATION
// ======================================================

const approveDonation = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "UPDATE donations SET status='approved' WHERE id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Donation Approved"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to approve donation"
        });

    }

};

// ======================================================
// REJECT DONATION
// ======================================================

const rejectDonation = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "UPDATE donations SET status='rejected' WHERE id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Donation Rejected"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to reject donation"
        });

    }

};

// ======================================================
// COMPLETE DONATION
// ======================================================

const completeDonation = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "UPDATE donations SET status='completed' WHERE id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Donation Completed"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to complete donation"
        });

    }

};

// ======================================================
// DELETE DONATION
// ======================================================

const deleteDonation = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM donations WHERE id=$1",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Donation Deleted Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to delete donation"
        });

    }

};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    adminLogin,
    getDashboard,

    getUsers,
    deleteUser,
    blockUser,

    getNGOs,
    approveNGO,
    rejectNGO,
    deleteNGO,

    getDonations,
    approveDonation,
    rejectDonation,
    completeDonation,
    deleteDonation
};