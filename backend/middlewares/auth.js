const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get the token from the request headers
    // We expect the frontend to send it as "Bearer <token>"
    const authHeader = req.header('Authorization');

    // 2. If there is no token, reject them immediately
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No VIP wristband (token) provided.' });
    }

    try {
        // 3. Clean up the token (remove the word "Bearer " if it's there)
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        // 4. Verify the token using your secret key from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Success! Attach the user's ID to the request so the route can use it
        req.user = decoded.user;
        
        // 6. 'next()' tells Express: "They passed the check, let them into the route now!"
        next(); 
        
    } catch (error) {
        // If the token is fake, expired, or tampered with
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};