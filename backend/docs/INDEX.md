# 📑 INDEX - SynthPanel AI Blog Automation

## 🎯 Quick Reference Guide

This is your **master index** for the SynthPanel AI Blog Automation documentation package. Use this for quick lookups, references, and navigation.

---

## 📚 Document Index

### Core Documents
| # | Document | Purpose | Pages | When to Read |
|---|----------|---------|-------|--------------|
| 1 | **START_HERE.md** | Entry point | 4 | First visit |
| 2 | **README_COMPLETE_PACKAGE.md** | Overview | 6 | Understanding scope |
| 3 | **INDEX.md** | This file | 5 | Quick reference |
| 4 | **QUICK_START_GUIDE.md** | Setup guide | 10 | Setting up |
| 5 | **POSTGRES_SETUP.md** | Database | 8 | Database setup |
| 6 | **BACKEND_COMPLETE_CODE.md** | Code files | 35 | Implementation |
| 7 | **SYNTHPANEL_BLOG_GUIDE.md** | Reference | 25 | Deep dive |

---

## 🛠️ Tech Stack Reference

### Core Technologies
```javascript
Runtime:      Node.js 18+ or Bun
Framework:    Next.js 14 (App Router)
Language:     JavaScript
Database:     PostgreSQL 15+
ORM:          Drizzle ORM
Package Mgr:  npm, yarn, pnpm, or bun
```

### AI Services
```javascript
Content:      OpenAI GPT-4 / Anthropic Claude
Images:       DALL-E 3 / Stable Diffusion
SEO:          Custom algorithm
Citations:    Web scraping + validation
```

### Key Dependencies
```json
{
  "next": "^14.0.0",
  "drizzle-orm": "^0.29.0",
  "postgres": "^3.4.0",
  "openai": "^4.20.0",
  "@anthropic-ai/sdk": "^0.9.0",
  "node-cron": "^3.0.3",
  "sharp": "^0.33.0",
  "cheerio": "^1.0.0",
  "zod": "^3.22.0"
}
```

---

## 📊 Database Schema Quick Reference

### Tables Overview
```sql
-- Core tables
posts              (id, slug, title, content, status, ...)
authors            (id, name, email, bio, avatar, ...)
tags               (id, name, slug, description, ...)
citations          (id, postId, url, title, trustScore, ...)

-- Junction tables
post_tags          (postId, tagId)

-- System tables
scheduled_posts    (id, postId, scheduledFor, status, ...)
generated_images   (id, postId, url, prompt, ...)
```

### Key Relationships
```
posts ←→ authors    (many-to-one)
posts ←→ tags       (many-to-many via post_tags)
posts ←→ citations  (one-to-many)
posts ←→ images     (one-to-many)
posts ←→ schedules  (one-to-one)
```

---

## 🔗 API Routes Quick Reference

### Post Management
```javascript
POST   /api/posts              // Create new post
GET    /api/posts              // List posts (paginated)
GET    /api/posts/[id]         // Get single post
PUT    /api/posts/[id]         // Update post
DELETE /api/posts/[id]         // Delete post
```

### AI Generation
```javascript
POST   /api/generate/content     // Generate post content
POST   /api/generate/image       // Generate cover image
POST   /api/generate/citations   // Generate citations
POST   /api/generate/seo         // Generate SEO metadata
```

### Scheduling
```javascript
GET    /api/schedule              // Get all scheduled posts
POST   /api/schedule              // Schedule a post
PUT    /api/schedule/[id]         // Update schedule
DELETE /api/schedule/[id]         // Cancel scheduled post
```

### SEO & Feeds
```javascript
GET    /api/sitemap.xml          // XML sitemap
GET    /api/rss.xml              // RSS feed
```

---

## 📁 File Structure Quick Reference

```
app/
├── blog/
│   ├── page.js                       # /blog
│   ├── [slug]/page.js                # /blog/post-title
│   ├── tag/[tag]/page.js             # /blog/tag/ai
│   └── author/[author]/page.js       # /blog/author/john
├── admin/
│   ├── dashboard/page.js             # Admin home
│   └── review/page.js                # Review queue
└── api/
    ├── posts/route.js
    ├── generate/
    │   ├── content/route.js
    │   ├── image/route.js
    │   ├── citations/route.js
    │   └── seo/route.js
    ├── schedule/route.js
    └── sitemap.xml/route.js

lib/
├── db/
│   ├── schema.js                     # Drizzle schema
│   ├── index.js                      # DB connection
│   └── migrations/                   # SQL migrations
├── ai/
│   ├── content-generator.js          # AI content
│   ├── image-generator.js            # AI images
│   ├── citation-engine.js            # Citations
│   └── seo-optimizer.js              # SEO
├── scheduler/
│   └── cron-jobs.js                  # Scheduling
├── seo/
│   ├── metadata.js                   # Meta tags
│   └── structured-data.js            # Schema.org
└── utils/
    ├── slugify.js
    └── validation.js

components/
├── blog/
│   ├── PostCard.jsx
│   ├── PostContent.jsx
│   ├── CitationList.jsx
│   └── TagList.jsx
└── admin/
    ├── Dashboard.jsx
    ├── ReviewQueue.jsx
    └── ScheduleManager.jsx
```

---

## 🔧 Environment Variables Reference

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/synthpanel"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..."          # Optional

# Anthropic (alternative to OpenAI)
ANTHROPIC_API_KEY="sk-ant-..."

# Image Generation
DALL_E_API_KEY="..."             # Usually same as OPENAI_API_KEY
STABILITY_API_KEY="..."          # For Stable Diffusion

# Next.js
NEXT_PUBLIC_SITE_URL="https://yoursite.com"
NEXT_PUBLIC_SITE_NAME="Your Blog Name"

# Scheduling
CRON_SECRET="your-random-secret"  # For securing cron endpoints

# Optional
REDIS_URL="redis://..."           # For caching
SENTRY_DSN="..."                  # For error tracking
```

---

## ⚡ Quick Commands Reference

### Installation
```bash
# Install Bun (optional)
curl -fsSL https://bun.sh/install | bash

# Create Next.js project
bunx create-next-app@latest synthpanel-blog --javascript --app

# Install dependencies
cd synthpanel-blog
npm install
# or bun install

# Install database dependencies
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Install AI dependencies
npm install openai @anthropic-ai/sdk

# Install other dependencies
npm install node-cron sharp cheerio zod next-seo
```

### Database
```bash
# Generate migration
npx drizzle-kit generate:pg

# Run migrations
npx drizzle-kit push:pg

# Open Drizzle Studio (GUI)
npx drizzle-kit studio
```

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## 🤖 AI Integration Quick Reference

### Content Generation
```javascript
import { generateBlogPost } from '@/lib/ai/content-generator';

const post = await generateBlogPost({
  topic: "Future of AI in 2024",
  tone: "professional",
  wordCount: 1500,
  includeIntro: true,
  includeConclusion: true,
  seoOptimized: true
});
```

### Image Generation
```javascript
import { generateCoverImage } from '@/lib/ai/image-generator';

const image = await generateCoverImage({
  prompt: "Futuristic AI technology visualization",
  style: "professional",
  aspectRatio: "16:9"
});
```

### Citation Generation
```javascript
import { generateCitations } from '@/lib/ai/citation-engine';

const citations = await generateCitations({
  topic: "AI trends 2024",
  minimumSources: 3,
  sourceDiversity: true,
  trustScoreThreshold: 70
});
```

---

## 📅 Automation Schedule Reference

### Default Cron Jobs
```javascript
// Generate draft post (daily at 2 AM)
'0 2 * * *': () => generateDraftPost()

// Publish scheduled posts (every 3 days at 10 AM)
'0 10 */3 * *': () => publishScheduledPosts()

// Update sitemap (weekly on Sunday at 3 AM)
'0 3 * * 0': () => updateSitemap()

// Cleanup old drafts (monthly on 1st at 1 AM)
'0 1 1 * *': () => cleanupOldDrafts()
```

### Cron Expression Quick Guide
```
┌─────── minute (0-59)
│ ┌───── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─ month (1-12)
│ │ │ │ ┌ day of week (0-6, 0=Sunday)
│ │ │ │ │
* * * * *

Examples:
'0 10 * * *'     # Every day at 10:00 AM
'0 10 */3 * *'   # Every 3 days at 10:00 AM
'0 2 * * 0'      # Every Sunday at 2:00 AM
'*/30 * * * *'   # Every 30 minutes
```

---

## 🎨 Component Usage Quick Reference

### Blog Post Card
```jsx
import PostCard from '@/components/blog/PostCard';

<PostCard
  post={post}
  showExcerpt={true}
  showTags={true}
  showAuthor={true}
/>
```

### Citation List
```jsx
import CitationList from '@/components/blog/CitationList';

<CitationList citations={post.citations} />
```

### Admin Dashboard
```jsx
import Dashboard from '@/components/admin/Dashboard';

<Dashboard
  posts={recentPosts}
  scheduledPosts={upcoming}
  stats={statistics}
/>
```

---

## 🔍 Common Queries Reference

### Get All Published Posts
```javascript
const posts = await db.select()
  .from(posts)
  .where(eq(posts.status, 'published'))
  .orderBy(desc(posts.publishedAt))
  .limit(10);
```

### Get Post with Author and Tags
```javascript
const post = await db.select()
  .from(posts)
  .leftJoin(authors, eq(posts.authorId, authors.id))
  .leftJoin(postTags, eq(posts.id, postTags.postId))
  .leftJoin(tags, eq(postTags.tagId, tags.id))
  .where(eq(posts.slug, slug))
  .get();
```

### Get Posts by Tag
```javascript
const posts = await db.select()
  .from(posts)
  .innerJoin(postTags, eq(posts.id, postTags.postId))
  .innerJoin(tags, eq(postTags.tagId, tags.id))
  .where(eq(tags.slug, tagSlug))
  .orderBy(desc(posts.publishedAt));
```

### Schedule Post for Publishing
```javascript
await db.insert(scheduledPosts).values({
  postId: post.id,
  scheduledFor: new Date('2024-02-15T10:00:00Z'),
  status: 'pending'
});
```

---

## 🚀 Deployment Quick Reference

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Docker
```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

CMD ["bun", "start"]
```

---

## 🐛 Troubleshooting Quick Reference

### Common Issues

**Database connection fails**
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
echo $DATABASE_URL
```

**AI API rate limits**
```javascript
// Add retry logic
const response = await retry(
  () => openai.chat.completions.create(...),
  { retries: 3, delay: 1000 }
);
```

**Images not generating**
```bash
# Check API key
echo $OPENAI_API_KEY

# Verify permissions
ls -la public/images/posts/
```

**Cron jobs not running**
```javascript
// Add logging
console.log('Cron job started:', new Date());
```

---

## 📖 SEO Best Practices

### Meta Tags
```javascript
// app/blog/layout.js or page.js

export const metadata = {
  title: 'Post Title | Your Blog',
  description: 'Post description...',
  openGraph: {
    title: 'Post Title',
    description: 'Post description...',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Title',
    description: 'Post description...',
  }
};
```

### Structured Data
```javascript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "image": post.coverImage,
  "datePublished": post.publishedAt,
  "author": {
    "@type": "Person",
    "name": post.author.name
  }
};
```

---

## ❓ Frequently Asked Questions

### General

**Q: Can I use this with an existing Next.js site?**  
A: Yes! Copy the relevant folders (app/blog, lib/ai, etc.) into your project.

**Q: What AI models are supported?**  
A: OpenAI GPT-4, Claude (Anthropic), DALL-E 3, Stable Diffusion.

**Q: Can I change the publishing schedule?**  
A: Yes, modify the cron expression in `lib/scheduler/cron-jobs.js`.

**Q: Is this production-ready?**  
A: Yes, includes error handling, validation, and security best practices.

### Technical

**Q: Why Bun instead of Node.js?**  
A: Bun is faster. Can use Node.js if preferred.

**Q: Why PostgreSQL instead of MongoDB?**  
A: Better for relational data, ACID compliance, and relational integrity with Drizzle.

**Q: Can I use a different ORM?**  
A: Yes, but Drizzle provides excellent performance.

**Q: How do I add custom fields to posts?**  
A: Modify `lib/db/schema.js` and run `npx drizzle-kit generate:pg`.

### Costs

**Q: How much does this cost to run?**  
A: ~$20-85/month (AI APIs $20-40, hosting $0-20, database $0-25).

**Q: Can I reduce AI costs?**  
A: Yes, use Claude (cheaper), cache results, or use open-source models.

**Q: Is there a free tier option?**  
A: Yes! Use Supabase free tier, Vercel free tier, and Claude API.

---

## 🎯 Next Steps

### Quick Start Path
1. ✅ Read this INDEX
2. → Read QUICK_START_GUIDE.md
3. → Copy BACKEND_COMPLETE_CODE.md
4. → Deploy!

### Detailed Learning Path
1. ✅ Read this INDEX
2. → Read SYNTHPANEL_BLOG_GUIDE.md
3. → Setup PostgreSQL (POSTGRES_SETUP.md)
4. → Follow QUICK_START_GUIDE.md
5. → Customize and extend

---

## 📊 Feature Checklist

### Core Features
- [x] AI content generation
- [x] Automated scheduling
- [x] Citation engine
- [x] Image generation
- [x] SEO optimization
- [x] Database schema
- [x] API routes
- [x] Admin dashboard

### Advanced Features
- [x] Tag management
- [x] Author management
- [x] Sitemap generation
- [x] RSS feed
- [x] Related posts
- [x] Reading time
- [x] Social sharing
- [x] Archive pages

### Optional Enhancements
- [ ] Email notifications
- [ ] Analytics integration
- [ ] Comment system
- [ ] Newsletter signup
- [ ] Dark mode
- [ ] Multi-language
- [ ] A/B testing
- [ ] Performance monitoring

---

## 🔗 External Resources

- **Bun:** https://bun.sh
- **Next.js:** https://nextjs.org
- **Drizzle:** https://orm.drizzle.team
- **PostgreSQL:** https://postgresql.org
- **OpenAI:** https://platform.openai.com
- **Anthropic:** https://anthropic.com

---

## 📝 Quick Notes

- All code is JavaScript
- All components are React Server Components by default
- All API routes include error handling
- All database queries use prepared statements
- All user inputs are validated with Zod

---

**For more details, see the complete documentation files! 📚**
