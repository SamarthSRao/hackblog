import { db, comments, stories } from '../lib/db/index.js';
import { eq } from 'drizzle-orm';

/**
 * Post a comment
 */
export async function createComment(req, res) {
    const { storyId, content, parentId } = req.body;
    const authorId = req.user.id;

    try {
        if (!storyId || !content) {
            return res.status(400).json({ error: 'Story ID and content are required' });
        }

        // Verify story exists
        const [story] = await db.select().from(stories).where(eq(stories.id, storyId)).limit(1);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const [newComment] = await db.insert(comments).values({
            content,
            authorId,
            storyId,
            parentId: parentId || null
        }).returning();

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Create Comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
