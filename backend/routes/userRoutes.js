const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();



// ===============================
// REGISTER
router.post("/register", async (req, res) => {
    try {

        const {
            name,
            email,
            mobile,
            password,
            role
        } = req.body;


        // Check required fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }


        // Only user or owner allowed
        const selectedRole =
            role === "owner" ? "owner" : "user";


        // Check existing mobile
        const existingUser = await User.findOne({
            mobile: mobile
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const newUser = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: hashedPassword,

            // IMPORTANT
            role: selectedRole
        });


        // Save to MongoDB
        await newUser.save();


        console.log(
            "✅ Account saved:",
            mobile,
            "Role:",
            selectedRole
        );


        res.status(201).json({
            message: "Account created successfully",
            role: selectedRole
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        const { mobile, password, role } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({
                message: "Mobile number and password are required"
            });
        }

        const user = await User.findOne({
            mobile: mobile,
            role: role || "user"
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;