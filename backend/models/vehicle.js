const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        model: {
            type: String,
            required: true
        },

        registration: {
            type: String,
            required: true,
            unique: true
        },

        year: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        fuel: {
            type: String,
            required: true
        },

        available: {
            type: Boolean,
            default: true
        },

        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);