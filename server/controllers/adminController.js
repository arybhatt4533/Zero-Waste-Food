const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(

            "SELECT * FROM admins WHERE email=$1",

            [email]

        );

        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Admin not found"

            });

        }

        const admin = result.rows[0];

        const validPassword = await bcrypt.compare(

            password,

            admin.password

        );

        if (!validPassword) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                admin_id: admin.admin_id

            },

            "mysecretkey",

            {

                expiresIn: "2h"

            }

        );

        res.json({

            success: true,

            token,

            admin: {

                id: admin.admin_id,

                name: admin.name,

                email: admin.email

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

module.exports = {

    adminLogin

};