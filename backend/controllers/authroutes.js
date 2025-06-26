import User from "../models/User.js"; // Ensure the path is correct
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register function
export const register = async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email: req.body.email });
        if (existingUser ) {
            return res.status(400).json({ success: false, message: 'User  already exists' });
        }

        // Create a new user
        const newUser  = new User({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10), // Hash the password
            photo: req.body.photo
        });

        // Save the user to the database
        await newUser .save();
        res.status(201).json({ success: true, message: 'Successfully created' });
        
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to create user', error: err.message });
    }
};

// Login function
export const login = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });

        res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email, photo: user.photo } });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
};
