const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(

    {
        // ==========================================
        // USER
        // ==========================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // OWNER
        // ==========================================

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // VEHICLE
        // ==========================================

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },


        vehicle: {
            type: String,
            required: true
        },


        vehicleType: {
            type: String,
            required: true
        },


        location: {
            type: String,
            required: true
        },


        // ==========================================
        // BOOKING DETAILS
        // ==========================================

        date: {
            type: String,
            required: true
        },


        days: {
            type: Number,
            required: true
        },


        amount: {
            type: Number,
            required: true
        },


        // ==========================================
        // BOOKING STATUS
        // ==========================================

        status: {
            type: String,

            enum: [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ],

            default: "Pending"
        },


        // ==========================================
        // LIVE VEHICLE / USER LOCATION
        // ==========================================

        currentLocation: {

            latitude: {
                type: Number,
                default: null
            },


            longitude: {
                type: Number,
                default: null
            },


            updatedAt: {
                type: Date,
                default: null
            },


            sharing: {
                type: Boolean,
                default: false
            }

        }

    },


    // ==========================================
    // AUTOMATIC CREATED / UPDATED TIME
    // ==========================================

    {
        timestamps: true
    }

);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );