# 📖 SYNTHPANEL AI BLOG AUTOMATION - Complete Guide

## 🎯 Overview

SynthPanel is a complete AI-powered blog automation system that generates, schedules, and publishes SEO-optimized blog posts automatically every 3 days.

**Tech Stack:**
- **Runtime:** Bun
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Drizzle ORM
- **AI:** OpenAI GPT-4 / Anthropic Claude + DALL-E 3
- **Language:** TypeScript

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │
│  │   Blog   │  │   Admin  │  │  Review Queue   │     │
│  │  /blog   │  │Dashboard │  │  /admin/review  │     │
│  └──────────┘  └──────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────┘
                         │
                    Next.js API
                         │
┌──────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  ┌────────┐  ┌──────────┐  ┌───────────┐              │
│  │ Posts  │  │ Generate │  │ Schedule  │              │
│  │  API   │  │   API    │  │    API    │              │
│  └────────┘  └──────────┘  └───────────┘              │
└──────────────────────────────────────────────────────────┘
          │               │               │
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│  Database   │   │  AI Services │   │  Scheduler   │
│             │   │              │   │              │
│ PostgreSQL  │   │ Content Gen  │   │  Cron Jobs   │
│ + Drizzle   │   │ Image Gen    │   │  Auto Pub    │
│             │   │ Citations    │   │              │
│             │   │ SEO Optimize │   │              │
└─────────────┘   └──────────────┘   └──────────────┘
```

---

## 📊 Database Schema

### Core Tables

#### Posts
```typescript
{
  id: uuid,
  slug: string (unique),
  title: string,
  content: text,
  excerpt: string,
  coverImage: string,
  seoTitle: string (60 chars),
  seoDescription: string (160 chars),
  keywords: string[],
  status: 'draft' | 'scheduled' | 'published',
  publishedAt: timestamp,
  authorId: uuid,
  readingTime: number,
  viewCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Authors
```typescript
{
  id: uuid,
  name: string,
  email: string (unique),
  bio: text,
  avatar: string,
  social: {
    twitter?: string,
    linkedin?: string,
    github?: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Tags
```typescript
{
  id: uuid,
  name: string (unique),
  slug: string (unique),
  description: text,
  createdAt: timestamp
}
```

#### Citations
```typescript
{
  id: uuid,
  postId: uuid,
  url: string,
  title: string,
  author: string,
  publishDate: timestamp,
  accessedDate: timestamp,
  trustScore: number (0-100),
  snippet: text,
  createdAt: timestamp
}
```

#### Scheduled Posts
```typescript
{
  id: uuid,
  postId: uuid (unique),
  scheduledFor: timestamp,
  status: 'pending' | 'published' | 'failed',
  attempts: number,
  lastError: text,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Generated Images
```typescript
{
  id: uuid,
  postId: uuid,
  url: string,
  prompt: string,
  altText: string,
  width: number,
  height: number,
  provider: 'dalle-3' | 'stable-diffusion',
  generatedAt: timestamp
}
```

---

## 🤖 AI Integration

### Content Generation Flow

```
1. User provides topic
         ↓
2. AI generates blog post content
   - Uses GPT-4 or Claude
   - Applies tone/style
   - Targets word count
         ↓
3. AI generates SEO metadata
   - Title (60 chars)
   - Description (160 chars)
   - Keywords
   - OG tags
         ↓
4. AI generates citations
   - Web research
   - Source validation
   - Trust scoring
         ↓
5. AI generates cover image
   - DALL-E 3 or Stable Diffusion
   - Alt text generation
   - Image optimization
         ↓
6. Complete post ready for review
```

### Content Generator API

```typescript
import { generateBlogPost } from '@/lib/ai/content-generator';

const result = await generateBlogPost({
  topic: "The Future of AI",
  tone: "professional",
  wordCount: 1500,
  keywords: ["AI", "Technology", "Future"],
  includeIntro: true,
  includeConclusion: true,
  targetAudience: "tech enthusiasts"
});

// Returns:
// {
//   title: "...",
//   content: "...",
//   excerpt: "...",
//   readingTime: 7,
//   suggestedTags: ["AI", "Technology", ...]
// }
```

### Image Generator API

```typescript
import { generateCoverImage } from '@/lib/ai/image-generator';

const image = await generateCoverImage({
  prompt: "AI concept visualization",
  style: "professional",
  aspectRatio: "16:9",
  quality: "hd"
});

// Returns:
// {
//   url: "https://...",
//   localPath: "/images/posts/...",
//   prompt: "...",
//   altText: "...",
//   width: 1792,
//   height: 1024
// }
```

### Citation Engine API

```typescript
import { generateCitations } from '@/lib/ai/citation-engine';

const citations = await generateCitations(
  "AI trends 2024",
  minimumSources: 3
);

// Returns:
// [
//   {
//     url: "https://...",
//     title: "...",
//     author: "...",
//     publishDate: Date,
//     snippet: "...",
//     trustScore: 85
//   },
//   ...
// ]
```

---

## 📅 Automation & Scheduling

### Publishing Schedule

**Default: Every 3 days at 10:00 AM**

```
Day 1  → Generate draft
Day 2  → Generate images & citations
Day 3  → Publish at 10:00 AM
Day 4  → Generate next draft
Day 5  → Generate images & citations
Day 6  → Publish at 10:00 AM
...continues
```

### Cron Job Configuration

```typescript
// lib/scheduler/cron-jobs.ts

import cron from 'node-cron';

// Generate draft daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  await generateDraftPost();
});

// Publish every 3 days at 10 AM
cron.schedule('0 10 */3 * *', async () => {
  await publishScheduledPosts();
});

// Update sitemap weekly
cron.schedule('0 3 * * 0', async () => {
  await updateSitemap();
});
```

### Manual Publishing

```bash
# Via API
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "uuid-here",
    "scheduledFor": "2024-02-15T10:00:00Z"
  }'

# Via Admin Dashboard
1. Go to /admin/dashboard
2. Select post
3. Click "Schedule"
4. Choose date/time
5. Confirm
```

---

## 🎨 Frontend Components

### Blog Home Page

```tsx
// app/blog/page.tsx

import { db, posts } from '@/lib/db';
import PostCard from '@/components/blog/PostCard';

export default async function BlogPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(10);

  return (
    <div>
      <h1>Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

### Post Detail Page

```tsx
// app/blog/[slug]/page.tsx

import { db, posts, citations } from '@/lib/db';
import PostContent from '@/components/blog/PostContent';
import CitationList from '@/components/blog/CitationList';

export default async function PostPage({ params }) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params.slug),
    with: {
      author: true,
      citations: true,
      postTags: { with: { tag: true } }
    }
  });

  return (
    <article>
      <PostContent post={post} />
      <CitationList citations={post.citations} />
    </article>
  );
}
```

---

## 🔐 Security

### API Protection

```typescript
// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Add authentication check
    const isAuthenticated = checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect cron endpoints
  if (request.nextUrl.pathname.startsWith('/api/cron')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}
```

### Environment Variables

```bash
# Required
DATABASE_URL=           # PostgreSQL connection
OPENAI_API_KEY=         # OpenAI API key
CRON_SECRET=            # Random secret for cron jobs

# Optional
ANTHROPIC_API_KEY=      # Alternative to OpenAI
STABILITY_API_KEY=      # For Stable Diffusion
REDIS_URL=             # For caching
SENTRY_DSN=            # Error tracking
```

---

## 📈 SEO Optimization

### Meta Tags

```tsx
// app/blog/[slug]/page.tsx

import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.coverImage],
    }
  };
}
```

### Structured Data

```tsx
// components/blog/PostContent.tsx

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "image": post.coverImage,
  "datePublished": post.publishedAt,
  "dateModified": post.updatedAt,
  "author": {
    "@type": "Person",
    "name": post.author.name,
  },
  "publisher": {
    "@type": "Organization",
    "name": "SynthPanel",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.png"
    }
  }
};

return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
  />
);
```

### Sitemap Generation

```typescript
// app/api/sitemap.xml/route.ts

export async function GET() {
  const posts = await db.select().from(posts).where(eq(posts.status, 'published'));
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL production
vercel env add OPENAI_API_KEY production
vercel env add CRON_SECRET production

# Deploy to production
vercel --prod
```

**vercel.json** (for cron jobs):
```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "0 10 */3 * *"
    }
  ]
}
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add PostgreSQL
railway add

# Set environment variables in dashboard
```

---

## 🧪 Testing

### API Testing with cURL

```bash
# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Content here...",
    "authorId": "uuid",
    "status": "draft"
  }'

# Generate content
curl -X POST http://localhost:3000/api/generate/content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI trends",
    "wordCount": 1000
  }'

# List posts
curl http://localhost:3000/api/posts?page=1&limit=10
```

---

## 📊 Monitoring

### Error Tracking (Sentry)

```bash
bun add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Analytics (Google Analytics)

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  );
}
```

---

## 🎯 Best Practices

1. **Content Quality:** Review AI-generated content before publishing
2. **SEO:** Always include keywords and meta descriptions
3. **Citations:** Verify sources have high trust scores
4. **Images:** Optimize images for web performance
5. **Scheduling:** Maintain consistent publishing schedule
6. **Backups:** Regular database backups
7. **Monitoring:** Set up error tracking and analytics
8. **Security:** Use environment variables for secrets

---

## 📚 Additional Features

### RSS Feed
### Search Functionality
### Related Posts
### Comment System
### Newsletter Integration
### Social Sharing
### Reading Progress Bar
### Dark Mode
### Multi-language Support

All covered in the complete codebase!

---

**For complete code, see `BACKEND_COMPLETE_CODE.md`**
