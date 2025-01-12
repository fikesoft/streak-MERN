import User from "../models/userModel.js";
import { generateToken } from '../utils/tokenUtils.js';
import bcrypt from 'bcryptjs';

export const registerUsers = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate input data
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Check if this is the first user to register
        const isFirstUser = (await User.countDocuments()) === 0;

        // Initialize streak with placeholder for `lastUpdated`
        const today = new Date().toISOString().split("T")[0];
        const streak = {
            startDate: today,          // Mark when the streak starts
            lastUpdated: "1970-01-01", // Placeholder value for "not yet logged in"
            history: [],               // No login history
        };

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password,
            isAdmin: isFirstUser, // First user becomes admin
            streak,
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT Token
        const token = generateToken({ userId: newUser._id, isAdmin: newUser.isAdmin });

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript access
            secure: false, // HTTPS in production
            sameSite: 'None', // Prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input data
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required while logging in." });
        }

        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // **Streak Logic**
        const today = new Date().toISOString().split("T")[0]; // Today's date
        const { lastUpdated, history } = existingUser.streak;

        // Handle placeholder value for `lastUpdated`
        if (lastUpdated === "1970-01-01" || lastUpdated === today) {
            if (lastUpdated === today) {
                const token = generateToken({ userId: existingUser._id, isAdmin: existingUser.isAdmin });

                // Set the token as an HTTP-only cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({
                    message: "You have already logged in today. Come back tomorrow",
                    fullName: existingUser.fullName,
                    isAdmin: existingUser.isAdmin,
                    streak: existingUser.streak,
                });
            }

            // First login: Initialize streak
            existingUser.streak.history.push(today);
            existingUser.streak.lastUpdated = today;

            await existingUser.save();
        } else {
            // Check if login is consecutive
            const lastDate = new Date(lastUpdated);
            const currentDate = new Date(today);

            if (currentDate - lastDate === 24 * 60 * 60 * 1000) {
                // Consecutive day
                existingUser.streak.history.push(today);
                existingUser.streak.lastUpdated = today;
            } else {
                // Break in streak (non-consecutive day)
                existingUser.streak.startDate = today;
                existingUser.streak.lastUpdated = today;
                existingUser.streak.history = [today];
            }

            await existingUser.save();
        }

        // Generate JWT Token
        const token = generateToken({ userId: existingUser._id, isAdmin: existingUser.isAdmin });

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite:'Lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successfully here is your quote for today",
            fullName: existingUser.fullName,
            isAdmin: existingUser.isAdmin,
            streak: existingUser.streak,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const logOutUser = (req,res)=>{
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure:false, // HTTPS in production
            sameSite: 'Lax', // Prevent CSRF attacks
        });
        

        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}
