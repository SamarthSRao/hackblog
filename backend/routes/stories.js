import { db, stories, users, comments } from '../lib/db/index.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all stories
 */
export async function getStories(req, res) {
    try {
        const result = await db.select({
            id: stories.id,
            title: stories.title,
            url: stories.url,
            text: stories.text,
            score: stories.score,
            author: users.username,
            createdAt: stories.createdAt
        })
            .from(stories)
            .leftJoin(users, eq(stories.authorId, users.id))
            .orderBy(desc(stories.createdAt));

        res.json(result);
    } catch (error) {
        console.error('Get Stories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Get story by ID with comments
 */
export async function getStoryById(req, res) {
    const { id } = req.params;
    try {
        const [story] = await db.select({
            id: stories.id,
            title: stories.title,
            url: stories.url,
            text: stories.text,
            score: stories.score,
            author: users.username,
            createdAt: stories.createdAt
        })
            .from(stories)
            .leftJoin(users, eq(stories.authorId, users.id))
            .where(eq(stories.id, id))
            .limit(1);

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const storyComments = await db.select({
            id: comments.id,
            content: comments.content,
            author: users.username,
            createdAt: comments.createdAt,
            parentId: comments.parentId
        })
            .from(comments)
            .leftJoin(users, eq(comments.authorId, users.id))
            .where(eq(comments.storyId, id))
            .orderBy(desc(comments.createdAt));

        res.json({ ...story, comments: storyComments });
    } catch (error) {
        console.error('Get Story error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Create a new story
 */
export async function createStory(req, res) {
    const { title, url, text } = req.body;
    const authorId = req.user.id;

    try {
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [newStory] = await db.insert(stories).values({
            title,
            url,
            text,
            authorId,
            score: 1 // Start with 1 point from author
        }).returning();

        res.status(201).json(newStory);
    } catch (error) {
        console.error('Create Story error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
