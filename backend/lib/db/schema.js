import { pgTable, uuid, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users Table
 * Stores user account information (Hacker News style)
 */
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    about: text('about'),
    karma: integer('karma').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Stories Table
 * Represents links or text-based discussion topics
 */
export const stories = pgTable('stories', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    url: text('url'),
    text: text('text'), // For "Ask HN" style posts
    score: integer('score').default(0).notNull(),
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Comments Table
 * Threaded comments for stories
 */
export const comments = pgTable('comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    storyId: uuid('story_id').references(() => stories.id, { onDelete: 'cascade' }).notNull(),
    parentId: uuid('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Votes Table
 * Tracks upvotes/downvotes
 */
export const votes = pgTable('votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    itemId: uuid('item_id').notNull(), // Can be storyId or commentId
    itemType: varchar('item_type', { length: 20 }).notNull(), // 'story' or 'comment'
    value: integer('value').notNull(), // 1 for upvote, -1 for downvote
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    stories: many(stories),
    comments: many(comments),
    votes: many(votes),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
    author: one(users, {
        fields: [stories.authorId],
        references: [users.id],
    }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
    story: one(stories, {
        fields: [comments.storyId],
        references: [stories.id],
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: 'replies',
    }),
    replies: many(comments, { relationName: 'replies' }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    user: one(users, {
        fields: [votes.userId],
        references: [users.id],
    }),
}));
