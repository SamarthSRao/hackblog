import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';

/**
 * Authentication Middleware
 * Verifies that the request comes from an authenticated user using JWT
 */
export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        const token = authHeader.split(' ')[1];

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
}

/**
 * Admin Middleware
 * Verifies that the authenticated user has admin privileges
 */
export function requireAdmin(req, res, next) {
    // Assuming role is stored in the JWT payload
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
}