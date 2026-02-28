import { db, users } from '../lib/db/index.js';
import { eq, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';

/**
 * Authentication Routes
 * Handles user login and registration with real auth
 */

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email or Username and password are required' });
        }

        // Find user by email OR username
        const [user] = await db.select().from(users)
            .where(sql`${users.email} = ${email} OR ${users.username} = ${email}`)
            .limit(1);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password hash
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success with token and user info (excluding password)
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function register(req, res) {
    const { name, email, password } = req.body; // 'name' comes from frontend, maps to 'username'

    try {
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists (by email OR username)
        const [existingUser] = await db.select().from(users)
            .where(or(eq(users.email, email), eq(users.username, name)))
            .limit(1);

        if (existingUser) {
            const conflictField = existingUser.email === email ? 'Email' : 'Username';
            return res.status(409).json({ error: `${conflictField} already exists` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const [newUser] = await db.insert(users).values({
            username: name,
            email,
            password: hashedPassword,
            about: 'New member',
            karma: 1 // Startup karma
        }).returning();

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        // Generate token immediately upon register
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getCurrentUser(req, res) {
    try {
        // req.user is set by authentication middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const [user] = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });

    } catch (error) {
        console.error('Get Current User error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}