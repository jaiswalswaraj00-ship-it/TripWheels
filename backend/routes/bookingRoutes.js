const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();


// ==========================================
// CREATE BOOKING
// ==========================================

router.post("/create", async (req, res) => {
    try {

        const {
            userId,
            ownerId,
            vehicleId,
            vehicle,
            vehicleType,
            location,
            date,
            days,
            amount
        } = req.body;


        if (
            !userId ||
            !ownerId ||
            !vehicleId ||
            !vehicle ||
            !vehicleType ||
            !location ||
            !date ||
            !days ||
            amount === undefined
        ) {
            return res.status(400).json({
                message: "Please fill all booking details"
            });
        }


        const booking = new Booking({
            userId,
            ownerId,
            vehicleId,
            vehicle,
            vehicleType,
            location,
            date,
            days,
            amount,
            status: "Pending"
        });


        await booking.save();


        res.status(201).json({
            message: "Booking created successfully",
            booking
        });


    } catch (error) {

        console.log("CREATE BOOKING ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET BOOKINGS OF USER
// ==========================================

router.get("/user/:userId", async (req, res) => {

    try {

        const bookings = await Booking.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });


        res.json(bookings);


    } catch (error) {

        console.log("GET USER BOOKINGS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET BOOKINGS OF OWNER
// ==========================================

router.get("/owner/:ownerId", async (req, res) => {

    try {

        const bookings = await Booking.find({
            ownerId: req.params.ownerId
        }).sort({ createdAt: -1 });


        res.json(bookings);


    } catch (error) {

        console.log("GET OWNER BOOKINGS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

router.put("/:id/status", async (req, res) => {

    try {

        const { status } = req.body;


        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );


        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }


        res.json({
            message: "Booking status updated",
            booking
        });


    } catch (error) {

        console.log("UPDATE BOOKING ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ==========================================
// UPDATE LIVE LOCATION
// ==========================================

router.put("/:id/location", async (req, res) => {

    try {

        const {
            latitude,
            longitude,
            sharing
        } = req.body;


        if (
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({
                message: "Location coordinates are required"
            });

        }


        const booking =
            await Booking.findByIdAndUpdate(
                req.params.id,

                {
                    currentLocation: {
                        latitude:
                            Number(latitude),

                        longitude:
                            Number(longitude),

                        updatedAt:
                            new Date(),

                        sharing:
                            sharing !== false
                    }
                },

                {
                    new: true
                }
            );


        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        res.json({

            message:
                "Live location updated",

            location:
                booking.currentLocation

        });


    } catch (error) {

        console.log(
            "UPDATE LOCATION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});

// ==========================================
// GET LIVE LOCATION
// ==========================================

router.get("/:id/location", async (req, res) => {

    try {

        const booking =
            await Booking.findById(
                req.params.id
            );


        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        if (
            !booking.currentLocation ||
            !booking.currentLocation.sharing
        ) {

            return res.json({

                sharing: false,

                message:
                    "Live location is not being shared"

            });

        }


        res.json({

            sharing: true,

            latitude:
                booking.currentLocation.latitude,

            longitude:
                booking.currentLocation.longitude,

            updatedAt:
                booking.currentLocation.updatedAt

        });


    } catch (error) {

        console.log(
            "GET LOCATION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});

module.exports = router;