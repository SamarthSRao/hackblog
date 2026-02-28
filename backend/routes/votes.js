import { db, votes, stories, comments, users } from '../lib/db/index.js';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Vote for a story or comment
 */
export async function toggleVote(req, res) {
    const { itemId, itemType, value } = req.body; // value: 1 for up, -1 for down (though HN usually only has up)
    const userId = req.user.id;

    if (!['story', 'comment'].includes(itemType)) {
        return res.status(400).json({ error: 'Invalid item type' });
    }

    try {
        // Check if vote already exists
        const [existingVote] = await db.select()
            .from(votes)
            .where(
                and(
                    eq(votes.userId, userId),
                    eq(votes.itemId, itemId),
                    eq(votes.itemType, itemType)
                )
            )
            .limit(1);

        if (existingVote) {
            // If the same value, remove it (toggle off)
            if (existingVote.value === value) {
                await db.delete(votes).where(eq(votes.id, existingVote.id));

                // Update item score
                const table = itemType === 'story' ? stories : comments;
                await db.update(table)
                    .set({ score: sql`${table.score} - ${value}` })
                    .where(eq(table.id, itemId));

                return res.json({ message: 'Vote removed', scoreDelta: -value });
            } else {
                // Change vote value
                await db.update(votes).set({ value }).where(eq(votes.id, existingVote.id));

                const table = itemType === 'story' ? stories : comments;
                await db.update(table)
                    .set({ score: sql`${table.score} + ${2 * value}` }) // e.g., -1 to +1 is a delta of 2
                    .where(eq(table.id, itemId));

                return res.json({ message: 'Vote updated', scoreDelta: 2 * value });
            }
        }

        // New vote
        await db.insert(votes).values({
            userId,
            itemId,
            itemType,
            value
        });

        // Update item score
        const table = itemType === 'story' ? stories : comments;
        await db.update(table)
            .set({ score: sql`${table.score} + ${value}` })
            .where(eq(table.id, itemId));

        // Increment author's karma
        let authorId;
        if (itemType === 'story') {
            const [story] = await db.select({ authorId: stories.authorId }).from(stories).where(eq(stories.id, itemId)).limit(1);
            authorId = story?.authorId;
        } else {
            const [comment] = await db.select({ authorId: comments.authorId }).from(comments).where(eq(comments.id, itemId)).limit(1);
            authorId = comment?.authorId;
        }

        if (authorId) {
            await db.update(users)
                .set({ karma: sql`${users.karma} + 1` })
                .where(eq(users.id, authorId));
        }

        res.json({ message: 'Vote cast', scoreDelta: value });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
