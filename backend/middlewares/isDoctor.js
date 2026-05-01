module.exports = function(req, res, next) {
    // req.user is populated by your existing auth.js middleware
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Forbidden: Doctor access required.' });
    }
    next(); 
};