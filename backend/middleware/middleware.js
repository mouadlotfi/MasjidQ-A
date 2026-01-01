// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}

// Middleware to check if user is an Imam
function requireImam(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.session.userRole !== 'Imam') {
        return res.status(403).json({ error: 'Only Imams can perform this action' });
    }
    next();
}

module.exports = { requireAuth, requireImam };
