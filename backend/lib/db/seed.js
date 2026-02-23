import { db, users, stories, comments } from './index.js';
import bcrypt from 'bcryptjs';

/**
 * Seed script to populate database with initial Hacker News style data
 * Run with: node lib/db/seed.js
 */
async function seed() {
    console.log('🌱 Seeding database...');

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create default users
    const [admin] = await db.insert(users).values({
        username: 'pg',
        email: 'paul@ycombinator.com',
        password: passwordHash,
        about: 'Lisp hacker and essayist.',
        karma: 1000
    }).returning();

    const [user2] = await db.insert(users).values({
        username: 'dang',
        email: 'dang@ycombinator.com',
        password: passwordHash,
        about: 'HN moderator.',
        karma: 500
    }).returning();

    console.log('✅ Created users:', admin.username, user2.username);

    // Create sample stories
    const [story1] = await db.insert(stories).values({
        title: 'How to build a Hacker News clone',
        url: 'https://github.com/drizzle-team/drizzle-orm',
        score: 42,
        authorId: admin.id,
    }).returning();

    const [story2] = await db.insert(stories).values({
        title: 'Show HN: My new coding assistant',
        text: 'I built this using LLMs and Drizzle ORM. What do you think?',
        score: 156,
        authorId: user2.id,
    }).returning();

    console.log('✅ Created sample stories:', story1.title, story2.title);

    // Create sample comments
    const [comment1] = await db.insert(comments).values({
        content: 'This is a great start! Drizzle is awesome.',
        authorId: user2.id,
        storyId: story1.id
    }).returning();

    await db.insert(comments).values({
        content: 'Thanks! I really like the type safety.',
        authorId: admin.id,
        storyId: story1.id,
        parentId: comment1.id
    });

    console.log('✅ Seeding complete!');
    process.exit(0);
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
