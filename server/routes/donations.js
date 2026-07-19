

const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

// ================= MULTER =================

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });


// ================= ADD DONATION =================

router.post("/", upload.single("foodImage"), async (req, res) => {

    try {

        const {
            foodName,
            quantity,
            restaurantName,
            expiry,
            location,
            user_id
        } = req.body;

        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const query = `
            INSERT INTO donations
            (
                food_name,
                quantity,
                restaurant_name,
                expiry_time,
                location,
                image_url,
                status,
                user_id,
                pickup_status
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,
                'available',
                $7,
                'pending'
            )
            RETURNING *
        `;

        const result = await pool.query(query, [
            foodName,
            quantity,
            restaurantName,
            expiry,
            location,
            imageUrl,
            user_id || null
        ]);

        res.status(201).json({
            success: true,
            message: "Donation Added Successfully",
            donation: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});


// ================= GET AVAILABLE DONATIONS =================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM donations
            WHERE status='available'
            ORDER BY id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


// ================= CLAIM DONATION =================

router.patch("/claim/:id", async (req, res) => {

     console.log("🔥 Claim API Hit");
    console.log("Donation ID:", req.params.id);
    console.log("Body:", req.body);

    const { id } = req.params;
    const { ngo_id } = req.body;

    try {

        // पहले check करो कि donation available है
        const check = await pool.query(
            "SELECT * FROM donations WHERE id=$1",
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Donation not found"
            });
        }

        if (check.rows[0].status === "claimed") {
            return res.status(400).json({
                success: false,
                error: "Donation already claimed"
            });
        }

        const result = await pool.query(
            `UPDATE donations
             SET
                 status='claimed',
                 pickup_status='claimed',
                 ngo_id=$1,
                 claimed_at=NOW()
             WHERE id=$2
             RETURNING *`,
            [ngo_id, id]
        );

        res.json({
            success: true,
            message: "Donation Claimed Successfully",
            donation: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }

});


module.exports = router;