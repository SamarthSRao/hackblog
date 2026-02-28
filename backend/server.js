import express from 'express';
import cors from 'cors';
import { login, register, getCurrentUser } from './routes/auth.js';
import { getUserProfile } from './routes/user.js';
import { getStories, getById, createStory } from './routes/stories.js';
import { createComment } from './routes/comments.js';
import { toggleVote } from './routes/votes.js';
import { authenticate } from './middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);
app.get('/api/auth/me', authenticate, getCurrentUser);
app.get('/api/users/:userId', getUserProfile);

// Stories & Comments
app.get('/api/stories', getStories);
app.get('/api/stories/:id', getById);
app.post('/api/stories', authenticate, createStory);
app.post('/api/comments', authenticate, createComment);
app.post('/api/votes', authenticate, toggleVote);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
