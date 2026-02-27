import { db, users, stories, comments } from '../lib/db/index.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get user profile with submissions and comments
 */
export async function getUserProfile(req, res) {
    const { userId } = req.params; // This could be username or UUID, usually passed as username in URLs

    try {
        // Try to find by username first (Hacker News style)
        let [user] = await db.select({
            id: users.id,
            username: users.username,
            about: users.about,
            karma: users.karma,
            createdAt: users.createdAt
        })
            .from(users)
            .where(eq(users.username, userId))
            .limit(1);

        // If not found by username, try by UUID if it looks like one
        if (!user && userId.length === 36) {
            [user] = await db.select({
                id: users.id,
                username: users.username,
                about: users.about,
                karma: users.karma,
                createdAt: users.createdAt
            })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's stories
        const userStories = await db.select({
            id: stories.id,
            title: stories.title,
            url: stories.url,
            score: stories.score,
            createdAt: stories.createdAt
        })
            .from(stories)
            .where(eq(stories.authorId, user.id))
            .orderBy(desc(stories.createdAt));

        // Get user's comments
        const userComments = await db.select({
            id: comments.id,
            content: comments.content,
            storyId: comments.storyId,
            createdAt: comments.createdAt
        })
            .from(comments)
            .where(eq(comments.authorId, user.id))
            .orderBy(desc(comments.createdAt));

        res.json({
            ...user,
            stories: userStories,
            comments: userComments
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}