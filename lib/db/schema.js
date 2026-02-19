import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Authors Table
 * Stores author/contributor information
 */
export const authors = pgTable('authors', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    bio: text('bio'),
    avatar: text('avatar'),
    social: jsonb('social'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Posts Table
 * Main blog posts content
 */
export const posts = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    coverImage: text('cover_image'),

    // SEO fields
    seoTitle: varchar('seo_title', { length: 60 }),
    seoDescription: varchar('seo_description', { length: 160 }),
    keywords: text('keywords').array(),

    // Status and publishing
    status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, scheduled, published
    publishedAt: timestamp('published_at'),

    // Relations
    authorId: uuid('author_id').references(() => authors.id),

    // Metadata
    readingTime: integer('reading_time'), // in minutes
    viewCount: integer('view_count').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        slugIdx: uniqueIndex('slug_idx').on(table.slug),
    };
});

/**
 * Tags Table
 * Post categorization tags
 */
export const tags = pgTable('tags', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Post Tags Junction Table
 * Many-to-many relationship between posts and tags
 */
export const postTags = pgTable('post_tags', {
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => {
    return {
        pk: uniqueIndex('post_tags_pk').on(table.postId, table.tagId),
    };
});

/**
 * Citations Table
 * Source citations for blog posts
 */
export const citations = pgTable('citations', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    url: text('url').notNull(),
    title: text('title').notNull(),
    author: text('author'),
    publishDate: timestamp('publish_date'),
    accessedDate: timestamp('accessed_date').defaultNow().notNull(),
    trustScore: integer('trust_score').default(50), // 0-100 credibility score
    snippet: text('snippet'), // Relevant excerpt from source
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Scheduled Posts Table
 * Tracks posts scheduled for future publishing
 */
export const scheduledPosts = pgTable('scheduled_posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull().unique(),
    scheduledFor: timestamp('scheduled_for').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, published, failed
    attempts: integer('attempts').default(0),
    lastError: text('last_error'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Generated Images Table
 * Tracks AI-generated images for posts
 */
export const generatedImages = pgTable('generated_images', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    prompt: text('prompt').notNull(),
    altText: text('alt_text').notNull(),
    width: integer('width'),
    height: integer('height'),
    provider: varchar('provider', { length: 50 }), // dalle-3, stable-diffusion
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

// Relations
export const authorsRelations = relations(authors, ({ many }) => ({
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(authors, {
        fields: [posts.authorId],
        references: [authors.id],
    }),
    postTags: many(postTags),
    citations: many(citations),
    generatedImages: many(generatedImages),
    scheduledPost: one(scheduledPosts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
    post: one(posts, {
        fields: [postTags.postId],
        references: [posts.id],
    }),
    tag: one(tags, {
        fields: [postTags.tagId],
        references: [tags.id],
    }),
}));

export const citationsRelations = relations(citations, ({ one }) => ({
    post: one(posts, {
        fields: [citations.postId],
        references: [posts.id],
    }),
}));

export const scheduledPostsRelations = relations(scheduledPosts, ({ one }) => ({
    post: one(posts, {
        fields: [scheduledPosts.postId],
        references: [posts.id],
    }),
}));

export const generatedImagesRelations = relations(generatedImages, ({ one }) => ({
    post: one(posts, {
        fields: [generatedImages.postId],
        references: [posts.id],
    }),
}));
