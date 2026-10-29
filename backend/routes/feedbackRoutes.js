const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();


// ==========================================
// SUBMIT FEEDBACK
// ==========================================

router.post("/create", async (req, res) => {

    try {

        const {
            userId,
            name,
            rating,
            message
        } = req.body;


        if (
            !name ||
            !rating ||
            !message
        ) {
            return res.status(400).json({
                message: "Please fill all feedback details"
            });
        }


        const feedback = new Feedback({

            userId:
                userId || null,

            name:
                name.trim(),

            rating:
                Number(rating),

            message:
                message.trim()

        });


        await feedback.save();


        res.status(201).json({

            message:
                "Feedback submitted successfully",

            feedback

        });


    } catch (error) {

        console.log(
            "CREATE FEEDBACK ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

});


// ==========================================
// GET ALL FEEDBACK
// ==========================================

router.get("/", async (req, res) => {

    try {

        const feedback =
            await Feedback.find()
                .sort({
                    createdAt: -1
                })
                .limit(20);


        res.json(feedback);


    } catch (error) {

        console.log(
            "GET FEEDBACK ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

});


module.exports = router;