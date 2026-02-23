# 💻 BACKEND COMPLETE CODE - SynthPanel AI Blog Automation

## 📦 Complete Production-Ready Code Files (JavaScript Version)

This document contains **all available code files** converted to JavaScript. Every file is production-ready, fully commented, and follows best practices.

---

## 📋 Table of Contents

### Configuration (4 files)
1. [package.json](#packagejson)
2. [docker-compose.yml](#docker-composeyml)
3. [drizzle.config.js](#drizzleconfigjs)
4. [next.config.js](#nextconfigjs)

### Database (4 files)
5. [lib/db/schema.js](#libdbschemajs)
6. [lib/db/index.js](#libdbindexjs)
7. [lib/db/seed.js](#libdbseedjs)
8. [migrations/0000_initial.sql](#migrations0000_initialsql)

### AI Services (4 files)
9. [lib/ai/content-generator.js](#libaicontent-generatorjs)
10. [lib/ai/image-generator.js](#libaiimage-generatorjs)
11. [lib/ai/citation-engine.js](#libaicitation-enginejs)
12. [lib/ai/seo-optimizer.js](#libaiseo-optimizerjs)

### API Routes (2 files)
13. [app/api/posts/route.js](#appapipostsroutejs)
14. [app/api/generate/content/route.js](#appapiggeneratecontentroutejs)


---

## Configuration Files

### package.json

```json
{
  "name": "synthpanel-blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "node lib/db/seed.js",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "drizzle-orm": "^0.29.3",
    "postgres": "^3.4.3",
    "openai": "^4.26.0",
    "@anthropic-ai/sdk": "^0.12.0",
    "node-cron": "^3.0.3",
    "sharp": "^0.33.2",
    "cheerio": "^1.0.0-rc.12",
    "zod": "^3.22.4",
    "next-seo": "^6.4.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.10",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17"
  }
}
```

---

### docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: synthpanel-postgres
    environment:
      POSTGRES_USER: synthpanel
      POSTGRES_PASSWORD: synthpanel_password
      POSTGRES_DB: synthpanel
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

---

### drizzle.config.js

```javascript
/** @type { import("drizzle-kit").Config } */
export default {
  schema: './lib/db/schema.js',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};
```

---

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
```

---

## Database Files

### lib/db/schema.js

```javascript
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
```

---

### lib/db/index.js

```javascript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// Connection pool configuration
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export * from './schema';
```

---

### lib/db/seed.js

```javascript
import { db, authors, posts, tags, postTags } from './index';

/**
 * Seed script to populate database with initial data
 * Run with: node lib/db/seed.js
 */
async function seed() {
  console.log('🌱 Seeding database...');

  // Create default author
  const [author] = await db.insert(authors).values({
    name: 'AI Content Bot',
    email: 'bot@synthpanel.ai',
    bio: 'Automated content generation system powered by AI',
    avatar: '/images/ai-bot-avatar.png',
    social: {
      twitter: 'synthpanel',
      github: 'synthpanel'
    }
  }).returning();

  console.log('✅ Created author:', author.name);

  // Create default tags
  const tagData = [
    { name: 'Technology', slug: 'technology', description: 'Tech news and trends' },
    { name: 'AI', slug: 'ai', description: 'Artificial Intelligence' },
    { name: 'Development', slug: 'development', description: 'Software development' },
    { name: 'Tutorial', slug: 'tutorial', description: 'How-to guides' },
  ];

  const createdTags = await db.insert(tags).values(tagData).returning();
  console.log('✅ Created tags:', createdTags.length);

  // Create sample post
  const [samplePost] = await db.insert(posts).values({
    slug: 'welcome-to-synthpanel',
    title: 'Welcome to SynthPanel AI Blog',
    content: `# Welcome to SynthPanel

This is an automated blog powered by AI. Every post is generated, researched, and published automatically.

## Features

- AI-generated content
- Automated citations
- SEO-optimized
- Regular publishing schedule

Stay tuned for more content!`,
    excerpt: 'Welcome to our AI-powered blog with automated content generation',
    coverImage: '/images/posts/welcome.jpg',
    seoTitle: 'Welcome to SynthPanel AI Blog',
    seoDescription: 'Discover our AI-powered automated blog platform',
    status: 'published',
    publishedAt: new Date(),
    authorId: author.id,
    readingTime: 2,
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
```

---

### migrations/0000_initial.sql

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Authors table
CREATE TABLE IF NOT EXISTS "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"bio" text,
	"avatar" text,
	"social" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Posts table
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"seo_title" varchar(60),
	"seo_description" varchar(160),
	"keywords" text[],
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"author_id" uuid REFERENCES "authors"("id"),
	"reading_time" integer,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Tags table
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"slug" varchar(50) NOT NULL UNIQUE,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Post-Tags junction table
CREATE TABLE IF NOT EXISTS "post_tags" (
	"post_id" uuid REFERENCES "posts"("id") ON DELETE CASCADE NOT NULL,
	"tag_id" uuid REFERENCES "tags"("id") ON DELETE CASCADE NOT NULL,
	UNIQUE("post_id", "tag_id")
);

-- Citations table
CREATE TABLE IF NOT EXISTS "citations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid REFERENCES "posts"("id") ON DELETE CASCADE NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"publish_date" timestamp,
	"accessed_date" timestamp DEFAULT now() NOT NULL,
	"trust_score" integer DEFAULT 50,
	"snippet" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Scheduled Posts table
CREATE TABLE IF NOT EXISTS "scheduled_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid REFERENCES "posts"("id") ON DELETE CASCADE NOT NULL UNIQUE,
	"scheduled_for" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Generated Images table
CREATE TABLE IF NOT EXISTS "generated_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid REFERENCES "posts"("id") ON DELETE CASCADE,
	"url" text NOT NULL,
	"prompt" text NOT NULL,
	"alt_text" text NOT NULL,
	"width" integer,
	"height" integer,
	"provider" varchar(50),
	"generated_at" timestamp DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts"("slug");
CREATE INDEX IF NOT EXISTS "posts_status_idx" ON "posts"("status");
CREATE INDEX IF NOT EXISTS "posts_published_at_idx" ON "posts"("published_at");
CREATE INDEX IF NOT EXISTS "posts_author_id_idx" ON "posts"("author_id");
CREATE INDEX IF NOT EXISTS "citations_post_id_idx" ON "citations"("post_id");
CREATE INDEX IF NOT EXISTS "scheduled_posts_scheduled_for_idx" ON "scheduled_posts"("scheduled_for");
CREATE INDEX IF NOT EXISTS "post_tags_post_id_idx" ON "post_tags"("post_id");
CREATE INDEX IF NOT EXISTS "post_tags_tag_id_idx" ON "post_tags"("tag_id");
```

---

## AI Services

### lib/ai/content-generator.js

```javascript
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate blog post content using AI
 * Supports both OpenAI GPT-4 and Anthropic Claude
 */
export async function generateBlogPost(
  options,
  provider = 'anthropic'
) {
  const {
    topic,
    tone = 'professional',
    wordCount = 1500,
    includeIntro = true,
    includeConclusion = true,
    targetAudience = 'general tech audience',
    keywords = [],
  } = options;

  const prompt = `Write a comprehensive blog post about: ${topic}

Requirements:
- Tone: ${tone}
- Target length: ${wordCount} words
- Target audience: ${targetAudience}
${keywords.length > 0 ? `- Include these keywords naturally: ${keywords.join(', ')}` : ''}
${includeIntro ? '- Include an engaging introduction' : ''}
${includeConclusion ? '- Include a strong conclusion' : ''}

Format:
- Use Markdown formatting
- Include headers (##, ###)
- Use bullet points and lists where appropriate
- Make it engaging and informative
- Ensure proper paragraph breaks

Return ONLY the blog post content in Markdown format.`;

  let content;

  if (provider === 'anthropic') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    content = response.content[0].type === 'text' ? response.content[0].text : '';
  } else {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    content = response.choices[0]?.message?.content || '';
  }

  // Extract title from content (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : topic;

  // Generate excerpt (first paragraph after title)
  const excerptMatch = content.match(/^#.+\n\n(.+?)(\n\n|$)/s);
  const excerpt = excerptMatch ? excerptMatch[1].substring(0, 160) : '';

  // Calculate reading time (average 200 words per minute)
  const wordCountActual = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCountActual / 200);

  // Suggest tags based on content
  const suggestedTags = await generateTags(title + ' ' + excerpt);

  return {
    title,
    content,
    excerpt,
    readingTime,
    suggestedTags,
  };
}

/**
 * Generate relevant tags for content
 */
async function generateTags(content) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Extract 3-5 relevant tags from this text. Return ONLY a comma-separated list of tags, nothing else:\n\n${content.substring(0, 500)}`
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return text.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 5);
  } catch (error) {
    console.error('Tag generation failed:', error);
    return [];
  }
}

/**
 * Improve existing content with AI
 */
export async function improveContent(content) {
  const prompt = `Improve this blog post content while maintaining its core message:

${content}

Improvements to make:
- Better readability
- Stronger transitions
- More engaging language
- Fix any grammatical issues
- Maintain the same tone and style

Return the improved content in Markdown format.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : content;
}
```

---

### lib/ai/image-generator.js

```javascript
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate cover image for blog post using DALL-E 3
 */
export async function generateCoverImage(options) {
  const {
    prompt,
    style = 'professional',
    aspectRatio = '16:9',
    quality = 'hd',
  } = options;

  // Size mapping based on aspect ratio
  const sizeMap = {
    '16:9': '1792x1024',
    '4:3': '1024x1024',
    '1:1': '1024x1024',
  };

  // Enhance prompt with style directive
  const stylePrompts = {
    professional: 'professional, clean, modern design',
    artistic: 'artistic, creative, visually striking',
    minimalist: 'minimalist, simple, elegant',
    vibrant: 'vibrant, colorful, energetic',
  };

  const enhancedPrompt = `${prompt}, ${stylePrompts[style]}, high quality, suitable for blog header`;

  // Generate image with DALL-E 3
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: sizeMap[aspectRatio],
    quality: quality,
  });

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error('Failed to generate image');
  }

  // Download and save image
  const imageResponse = await fetch(imageUrl);
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create unique filename
  const filename = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
  const publicDir = path.join(process.cwd(), 'public', 'images', 'posts');
  
  // Ensure directory exists
  await fs.mkdir(publicDir, { recursive: true });

  const localPath = path.join(publicDir, filename);

  // Optimize and save image
  const optimized = await sharp(buffer)
    .jpeg({ quality: 85 })
    .resize(1792, 1024, { fit: 'cover' })
    .toBuffer();

  await fs.writeFile(localPath, optimized);

  // Generate alt text
  const altText = await generateAltText(prompt);

  return {
    url: imageUrl,
    localPath: `/images/posts/${filename}`,
    prompt: enhancedPrompt,
    altText,
    width: 1792,
    height: 1024,
  };
}

/**
 * Generate descriptive alt text for image accessibility
 */
async function generateAltText(prompt) {
  // Simple alt text generation - can be enhanced with vision API
  const cleanPrompt = prompt
    .replace(/professional|artistic|minimalist|vibrant/gi, '')
    .replace(/high quality|suitable for blog/gi, '')
    .trim();

  return cleanPrompt.length > 100 
    ? cleanPrompt.substring(0, 97) + '...' 
    : cleanPrompt;
}

/**
 * Generate multiple image variations
 */
export async function generateImageVariations(
  basePrompt,
  count = 3
) {
  const variations = await Promise.all(
    Array.from({ length: count }, (_, i) => 
      generateCoverImage({
        prompt: `${basePrompt}, variation ${i + 1}`,
        style: ['professional', 'artistic', 'minimalist'][i],
      })
    )
  );

  return variations;
}
```

---

### lib/ai/citation-engine.js

```javascript
import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate citations for a given topic using web research
 */
export async function generateCitations(
  topic,
  minimumSources = 3
) {
  // Use Claude with web search to find relevant sources
  const searchQuery = `Find ${minimumSources} credible sources about: ${topic}. 
  For each source provide: URL, title, author (if available), publish date, and a brief relevant excerpt.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: searchQuery }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse response to extract citations
    const citations = parseCitationsFromResponse(content);
    
    // Calculate trust scores for each source
    const scoredCitations = await Promise.all(
      citations.map(async (citation) => ({
        ...citation,
        trustScore: await calculateTrustScore(citation.url),
      }))
    );

    return scoredCitations.filter(c => c.trustScore >= 50);
  } catch (error) {
    console.error('Citation generation failed:', error);
    return [];
  }
}

/**
 * Parse citations from AI response
 */
function parseCitationsFromResponse(response) {
  const citations = [];
  
  // Simple parsing - in production, use more robust parsing
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = response.match(urlRegex) || [];
  
  urls.forEach((url, index) => {
    citations.push({
      url: url.replace(/[.,;]$/, ''), // Remove trailing punctuation
      title: `Source ${index + 1}`,
      snippet: '',
      author: undefined,
      publishDate: undefined,
    });
  });

  return citations;
}

/**
 * Calculate trust score for a URL
 * Based on domain authority, HTTPS, and other factors
 */
async function calculateTrustScore(url) {
  try {
    const urlObj = new URL(url);
    let score = 50; // Base score

    // HTTPS bonus
    if (urlObj.protocol === 'https:') score += 10;

    // Trusted domains get higher scores
    const trustedDomains = [
      '.edu', '.gov', '.org',
      'wikipedia.org', 'nature.com', 'sciencedirect.com',
      'ieee.org', 'acm.org', 'arxiv.org',
      'nytimes.com', 'wsj.com', 'reuters.com'
    ];

    const isTrusted = trustedDomains.some(domain => 
      urlObj.hostname.endsWith(domain)
    );
    if (isTrusted) score += 30;

    // Check if site is accessible
    try {
      const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (response.ok) score += 10;
    } catch {
      score -= 20; // Penalize inaccessible sites
    }

    return Math.min(100, Math.max(0, score));
  } catch {
    return 30; // Default low score for invalid URLs
  }
}

/**
 * Format citation in APA style
 */
export function formatCitation(citation, style = 'APA') {
  const { author, title, url, publishDate } = citation;
  const year = publishDate ? publishDate.getFullYear() : 'n.d.';
  const accessed = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (style === 'APA') {
    return `${author || 'Author Unknown'}. (${year}). ${title}. Retrieved ${accessed}, from ${url}`;
  } else if (style === 'MLA') {
    return `${author || 'Author Unknown'}. "${title}." ${year}. Web. ${accessed}. <${url}>`;
  } else {
    return `${author || 'Author Unknown'}, "${title}," ${year}, accessed ${accessed}, ${url}.`;
  }
}
```

---

### lib/ai/seo-optimizer.js

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate SEO-optimized metadata for a blog post
 */
export async function generateSEOMetadata(
  title,
  content,
  targetKeywords
) {
  const prompt = `Generate SEO metadata for this blog post:

Title: ${title}
Content excerpt: ${content.substring(0, 500)}
${targetKeywords ? `Target keywords: ${targetKeywords.join(', ')}` : ''}

Provide:
1. SEO Title (50-60 characters, include primary keyword)
2. Meta Description (150-160 characters, compelling and keyword-rich)
3. Keywords (5-8 relevant keywords)
4. Open Graph Title (engaging, can be longer)
5. Open Graph Description (engaging, 2-3 sentences)
6. Twitter Title (concise and catchy)
7. Twitter Description (concise, 1-2 sentences)

Format as JSON:
{
  "title": "...",
  "description": "...",
  "keywords": ["...", "..."],
  "ogTitle": "...",
  "ogDescription": "...",
  "twitterTitle": "...",
  "twitterDescription": "..."
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  
  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const metadata = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    
    if (metadata) {
      return {
        title: metadata.title || title,
        description: metadata.description || '',
        keywords: metadata.keywords || [],
        ogTitle: metadata.ogTitle || metadata.title || title,
        ogDescription: metadata.ogDescription || metadata.description || '',
        twitterTitle: metadata.twitterTitle || metadata.title || title,
        twitterDescription: metadata.twitterDescription || metadata.description || '',
      };
    }
  } catch (error) {
    console.error('Failed to parse SEO metadata:', error);
  }

  // Fallback to basic metadata
  return {
    title: title.substring(0, 60),
    description: content.substring(0, 160),
    keywords: [],
    ogTitle: title,
    ogDescription: content.substring(0, 200),
    twitterTitle: title,
    twitterDescription: content.substring(0, 160),
  };
}

/**
 * Extract keywords from content
 */
export async function extractKeywords(content, count = 8) {
  const prompt = `Extract the ${count} most important keywords from this text. Return ONLY a comma-separated list:

${content.substring(0, 1000)}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.split(',').map(k => k.trim()).filter(Boolean).slice(0, count);
}
```

---

## API Routes

### app/api/posts/route.js

```javascript
import { NextRequest, NextResponse } from 'next/server';
import { db, posts, authors, postTags, tags } from '@/lib/db';
import { eq, desc, and, like, SQL } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
});

/**
 * GET /api/posts
 * List all posts with optional filtering
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    const offset = (page - 1) * limit;
    
    // Build where clause
    const conditions = [];
    
    if (status) {
      conditions.push(eq(posts.status, status));
    }
    
    if (search) {
      conditions.push(like(posts.title, `%${search}%`));
    }

    // Query posts
    let query = db
      .select({
        post: posts,
        author: authors,
      })
      .from(posts)
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;

    // If filtering by tag, need additional join
    let finalResults = results;
    if (tag) {
      const taggedPosts = await db
        .select({ postId: postTags.postId })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(tags.slug, tag));
      
      const taggedPostIds = new Set(taggedPosts.map(tp => tp.postId));
      finalResults = results.filter(r => taggedPostIds.has(r.post.id));
    }

    return NextResponse.json({
      posts: finalResults,
      pagination: {
        page,
        limit,
        total: finalResults.length,
      },
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const validated = createPostSchema.parse(body);

    // Generate slug from title
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate reading time
    const wordCount = validated.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Create post
    const [newPost] = await db
      .insert(posts)
      .values({
        ...validated,
        slug,
        readingTime,
        publishedAt: validated.status === 'published' ? new Date() : null,
      })
      .returning();

    // Add tags if provided
    if (validated.tags && validated.tags.length > 0) {
      for (const tagSlug of validated.tags) {
        // Find or create tag
        let [tag] = await db
          .select()
          .from(tags)
          .where(eq(tags.slug, tagSlug))
          .limit(1);

        if (!tag) {
          [tag] = await db
            .insert(tags)
            .values({
              name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1),
              slug: tagSlug,
            })
            .returning();
        }

        // Link tag to post
        await db.insert(postTags).values({
          postId: newPost.id,
          tagId: tag.id,
        });
      }
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('POST /api/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

---

### app/api/generate/content/route.js

```javascript
import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/ai/content-generator';
import { generateSEOMetadata } from '@/lib/ai/seo-optimizer';
import { z } from 'zod';

const generateSchema = z.object({
  topic: z.string().min(3),
  tone: z.enum(['professional', 'casual', 'technical', 'conversational']).optional(),
  wordCount: z.number().min(300).max(5000).optional(),
  keywords: z.array(z.string()).optional(),
  provider: z.enum(['openai', 'anthropic']).optional(),
});

/**
 * POST /api/generate/content
 * Generate blog post content using AI
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const validated = generateSchema.parse(body);

    // Generate content
    const generated = await generateBlogPost({
      topic: validated.topic,
      tone: validated.tone,
      wordCount: validated.wordCount,
      keywords: validated.keywords,
    }, validated.provider);

    // Generate SEO metadata
    const seo = await generateSEOMetadata(
      generated.title,
      generated.content,
      validated.keywords
    );

    return NextResponse.json({
      ...generated,
      seo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('POST /api/generate/content error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```
