import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const { token } = req.cookies; // Get the token from cookies

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Token missing." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
    }
};
