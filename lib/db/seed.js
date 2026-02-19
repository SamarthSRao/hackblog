import { db, authors, posts, tags, postTags } from './index.js';

/**
 * Seed script to populate database with initial data
 * Run with: node lib/db/seed.js
 */
async function seed() {
    console.log('🌱 Seeding database...');

    // Create default author
    const [author] = await db.insert(authors).values({
        name: 'HackBlog Admin',
        email: 'admin@hackblog.com',
        bio: 'Administrator for HackBlog',
        avatar: '/images/admin-avatar.png',
        social: {
            twitter: 'hackblog',
            github: 'hackblog'
        }
    }).returning();

    console.log('✅ Created author:', author.name);

    // Create default tags
    const tagData = [
        { name: 'Technology', slug: 'technology', description: 'Tech news and trends' },
        { name: 'Coding', slug: 'coding', description: 'Programming tutorials and tips' },
        { name: 'Security', slug: 'security', description: 'Cybersecurity insights' },
        { name: 'Hackathon', slug: 'hackathon', description: 'Hackathon news and events' },
    ];

    const createdTags = await db.insert(tags).values(tagData).returning();
    console.log('✅ Created tags:', createdTags.length);

    // Create sample post
    const [samplePost] = await db.insert(posts).values({
        slug: 'welcome-to-hackblog',
        title: 'Welcome to HackBlog',
        content: `# Welcome to HackBlog

This is the start of something great. A place to share knowledge, code, and ideas.

## Features

- Modern tech stack
- Fast performance
- Clean design

Stay tuned for more content!`,
        excerpt: 'Welcome to HackBlog, your new favorite tech blog.',
        coverImage: '/images/posts/welcome.jpg',
        seoTitle: 'Welcome to HackBlog',
        seoDescription: 'Discover HackBlog - the best place for tech insights',
        status: 'published',
        publishedAt: new Date(),
        authorId: author.id,
        readingTime: 1,
    }).returning();

    console.log('✅ Created sample post:', samplePost.title);

    // Link tags to post
    await db.insert(postTags).values([
        { postId: samplePost.id, tagId: createdTags[0].id },
        { postId: samplePost.id, tagId: createdTags[1].id },
    ]);

    console.log('✅ Seeding complete!');
    process.exit(0);
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
