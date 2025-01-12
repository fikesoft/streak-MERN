import bcrypt from 'bcrypt';

// Middleware to hash passwords
export const hashPassword = async (req, res, next) => {
    try {
        // Step 1: Check if the password exists in the request body
        if (req.body.password) {
            const saltRounds = 10; // Number of salt rounds for hashing (higher = more secure, but slower)
            
            // Step 2: Hash the password
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        // Step 3: Call next() to pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Step 4: Handle errors (e.g., if bcrypt.hash fails)
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Error processing password." });
    }
};
