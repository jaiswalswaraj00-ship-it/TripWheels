const express = require("express");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

// ADD VEHICLE
router.post("/add", async (req, res) => {
    try {
        const {
            ownerId,
            type,
            brand,
            model,
            registration,
            year,
            price,
            location,
            fuel,
            available,
            image
        } = req.body;

        if (
            !ownerId ||
            !type ||
            !brand ||
            !model ||
            !registration ||
            !year ||
            !price ||
            !location ||
            !fuel
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const existingVehicle = await Vehicle.findOne({
            registration: registration.toUpperCase()
        });

        if (existingVehicle) {
            return res.status(400).json({
                message: "Vehicle with this registration already exists"
            });
        }

        const vehicle = new Vehicle({
            ownerId,
            type,
            brand,
            model,
            registration: registration.toUpperCase(),
            year,
            price,
            location,
            fuel,
            available: available ?? true,
            image: image || ""
        });

        await vehicle.save();

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle
        });

    } catch (error) {
        console.log("ADD VEHICLE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// GET ALL VEHICLES
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            available: true
        }).sort({ createdAt: -1 });

        res.json(vehicles);

    } catch (error) {
        console.log("GET ALL VEHICLES ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// GET VEHICLES OF OWNER
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            ownerId: req.params.ownerId
        }).sort({ createdAt: -1 });

        res.json(vehicles);

    } catch (error) {
        console.log("GET VEHICLES ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==========================================
// GET SINGLE VEHICLE
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const vehicle = await Vehicle.findById(
            req.params.id
        );

        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle not found"
            });

        }

        res.json(vehicle);

    } catch (error) {

        console.log(
            "GET SINGLE VEHICLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// UPDATE VEHICLE
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const {
            type,
            brand,
            model,
            registration,
            year,
            price,
            location,
            fuel,
            available,
            image
        } = req.body;


        const vehicle =
            await Vehicle.findByIdAndUpdate(

                req.params.id,

                {
                    type,
                    brand,
                    model,
                    registration:
                        registration.toUpperCase(),
                    year,
                    price,
                    location,
                    fuel,
                    available,
                    image
                },

                {
                    new: true,
                    runValidators: true
                }
            );


        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle not found"
            });

        }


        res.json({

            message:
                "Vehicle updated successfully",

            vehicle

        });


    } catch (error) {

        console.log(
            "UPDATE VEHICLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});
// DELETE VEHICLE

router.delete("/:id", async (req, res) => {

    try {

        const vehicle = await Vehicle.findByIdAndDelete(
            req.params.id
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.json({
            message: "Vehicle deleted successfully"
        });

    } catch (error) {

        console.log("DELETE VEHICLE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
module.exports = router;