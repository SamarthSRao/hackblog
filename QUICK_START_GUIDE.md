# ⚡ QUICK START GUIDE - SynthPanel AI Blog Automation

## 🎯 Goal

Get your AI-powered blog automation system running in **30-60 minutes**.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** or **Bun** installed
- [ ] **PostgreSQL 15+** installed (local, Docker, or cloud)
- [ ] **OpenAI API key** or **Anthropic API key**
- [ ] **Git** installed
- [ ] **Code editor** (VS Code recommended)
- [ ] **Terminal/Command line** access

---

## 🚀 Step 1: Install Bun Runtime (5 minutes)

### macOS / Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Verify Installation
```bash
bun --version
# Should output: 1.0.0 or higher
```

---

## 🗄️ Step 2: Setup PostgreSQL (15 minutes)

We recommended using **Docker** for the easiest setup. See `POSTGRES_SETUP.md` for detailed instructions.

### Docker Quick Start

1. Create `docker-compose.yml` (content in `BACKEND_COMPLETE_CODE.md`)
2. Run:
```bash
docker-compose up -d
```

### Alternative: Cloud Database
- **Supabase** (Free tier available)
- **Railway** (Free tier available)

### Create Database (if using local/cloud)
```bash
# Local PostgreSQL
createdb synthpanel

# Or using psql
psql postgres
CREATE DATABASE synthpanel;
\q
```

---

## 📦 Step 3: Create Next.js Project (5 minutes)

```bash
# Create new Next.js app with JavaScript
bunx create-next-app@latest synthpanel-blog --javascript --app --tailwind --eslint

# Navigate to project
cd synthpanel-blog

# Install dependencies
bun install

# Install additional packages
bun add drizzle-orm postgres
bun add -D drizzle-kit

# Install AI SDKs
bun add openai @anthropic-ai/sdk

# Install utilities
bun add node-cron sharp cheerio zod next-seo
bun add react-markdown remark-gfm rehype-highlight date-fns
```

---

## 🔧 Step 4: Configure Environment Variables (3 minutes)

Create `.env.local` file in project root:

```bash
# Database
DATABASE_URL="postgresql://synthpanel:synthpanel_password@localhost:5432/synthpanel"

# OpenAI (for GPT-4 and DALL-E 3)
OPENAI_API_KEY="sk-..."

# Anthropic (for Claude - alternative to OpenAI)
ANTHROPIC_API_KEY="sk-ant-..."

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="SynthPanel Blog"

# Cron Secret (for securing scheduled jobs)
CRON_SECRET="your-random-secret-string-here"
```

### Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

---

## 📁 Step 5: Create Project Structure (2 minutes)

```bash
# Create directory structure
mkdir -p lib/db lib/ai lib/scheduler lib/seo lib/utils
mkdir -p app/api/posts app/api/generate/content app/api/generate/image
mkdir -p app/api/generate/citations app/api/schedule app/api/sitemap.xml
mkdir -p app/blog/[slug] app/blog/tag/[tag] app/blog/author/[author]
mkdir -p app/admin/dashboard app/admin/review
mkdir -p components/blog components/admin
mkdir -p public/images/posts
mkdir -p migrations
```

---

## 💻 Step 6: Copy Code Files (15 minutes)

**Now copy all code from `BACKEND_COMPLETE_CODE.md` into your project:**

### Core Configuration (4 files)
```bash
# Copy these from BACKEND_COMPLETE_CODE.md:
- package.json (merge with existing)
- docker-compose.yml (if using Docker)
- drizzle.config.js
- next.config.js
```

### Database Files (4 files)
```bash
# lib/db/
- schema.js
- index.js  
- seed.js

# migrations/
- 0000_initial.sql
```

### AI Services (4 files)
```bash
# lib/ai/
- content-generator.js
- image-generator.js
- citation-engine.js
- seo-optimizer.js
```

### API Routes (6 files)
```bash
# app/api/
- posts/route.js
- generate/content/route.js
- generate/image/route.js
- generate/citations/route.js
- schedule/route.js
- sitemap.xml/route.js
```

### Utilities (3 files)
```bash
# lib/
- scheduler/cron-jobs.js
- seo/metadata.js
- seo/structured-data.js
```

### Frontend Components (5 files)
```bash
# app/blog/
- page.js
- [slug]/page.js

# components/blog/
- PostCard.jsx
- PostContent.jsx
- CitationList.jsx
```

**📝 Note:** All these files are available in `BACKEND_COMPLETE_CODE.md` (converted to JS) - simply copy and paste them into your project.

---

## 🗃️ Step 7: Setup Database (5 minutes)

```bash
# Generate initial migration
bun drizzle-kit generate:pg

# Push schema to database
bun drizzle-kit push:pg

# Seed database with initial data
node lib/db/seed.js

# (Optional) Open Drizzle Studio to view data
bun drizzle-kit studio
```

---

## 🧪 Step 8: Test the Setup (10 minutes)

### Start Development Server
```bash
bun dev
```

Open http://localhost:3000

### Test API Endpoints

**1. Create a test post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post content.",
    "authorId": "YOUR_AUTHOR_ID_FROM_SEED",
    "status": "published"
  }'
```

**2. Generate AI content:**
```bash
curl -X POST http://localhost:3000/api/generate/content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "The Future of AI",
    "tone": "professional",
    "wordCount": 1000
  }'
```

**3. List all posts:**
```bash
curl http://localhost:3000/api/posts
```

**4. Visit blog page:**
```
http://localhost:3000/blog
```

---

## 🤖 Step 9: Setup Automated Publishing (5 minutes)

### Create Cron Job Endpoint

Create `app/api/cron/publish/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { db, posts, scheduledPosts } from '@/lib/db';
import { eq, lte, and } from 'drizzle-orm';

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find posts scheduled for now or earlier
    const now = new Date();
    const toPublish = await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.status, 'pending'),
          lte(scheduledPosts.scheduledFor, now)
        )
      );

    // Publish each post
    for (const scheduled of toPublish) {
      await db
        .update(posts)
        .set({
          status: 'published',
          publishedAt: now,
        })
        .where(eq(posts.id, scheduled.postId));

      await db
        .update(scheduledPosts)
        .set({ status: 'published' })
        .where(eq(scheduledPosts.id, scheduled.id));
    }

    return NextResponse.json({
      published: toPublish.length,
      timestamp: now,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Setup Cron Job

**Using Vercel Cron:**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/publish",
    "schedule": "0 10 */3 * *"
  }]
}
```

**Using GitHub Actions (for other platforms):**

Create `.github/workflows/publish.yml`:
```yaml
name: Publish Scheduled Posts
on:
  schedule:
    - cron: '0 10 */3 * *' # Every 3 days at 10 AM
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger publish
        run: |
          curl -X GET https://yoursite.com/api/cron/publish \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## ✅ Step 10: Create Your First AI Post (5 minutes)

### Using the API:

```bash
# 1. Generate content
GENERATED=$(curl -X POST http://localhost:3000/api/generate/content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Introduction to Machine Learning",
    "tone": "professional",
    "wordCount": 1500,
    "keywords": ["AI", "ML", "Technology"]
  }')

# 2. Generate cover image
IMAGE=$(curl -X POST http://localhost:3000/api/generate/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Machine learning concept visualization",
    "style": "professional"
  }')

# 3. Generate citations
CITATIONS=$(curl -X POST http://localhost:3000/api/generate/citations \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning introduction"
  }')

# 4. Create the post (combine all data)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d "{ ... combined data ... }"
```

### Using Admin Dashboard:

1. Visit: http://localhost:3000/admin/dashboard
2. Click "Generate New Post"
3. Enter topic
4. Review generated content
5. Schedule or publish

---

## 🚀 Step 11: Deploy to Production (Optional)

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add CRON_SECRET

# Deploy to production
vercel --prod
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add PostgreSQL
railway add

# Deploy
railway up

# Add environment variables in Railway dashboard
```

---

## 📊 Step 12: Monitor and Maintain

### Check Scheduled Posts
```bash
curl http://localhost:3000/api/schedule
```

### View Database
```bash
bun drizzle-kit studio
# Opens at http://localhost:4983
```

### Check Logs
```bash
# Development
bun dev

# Production (Vercel)
vercel logs
```

---

## 🐛 Troubleshooting

### Database Connection Fails
```bash
# Test connection
psql $DATABASE_URL

# If fails, check:
# 1. PostgreSQL is running (Docker container running?)
# 2. DATABASE_URL is correct
# 3. Database exists
# 4. User has permissions
```

### AI API Errors
```bash
# Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Test Anthropic
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
bun install
bun dev
```

### Image Generation Fails
```bash
# Check permissions
chmod 755 public/images/posts

# Verify Sharp installation
bun add sharp --force
```

---

## ✅ Success Checklist

After completing all steps, you should have:

- [ ] Running Next.js application
- [ ] PostgreSQL database with schema
- [ ] API routes responding
- [ ] AI content generation working
- [ ] Blog pages rendering
- [ ] Automated scheduling configured
- [ ] Admin dashboard accessible
- [ ] (Optional) Deployed to production

---

## 🎯 Next Steps

1. **Customize Design:** Edit components in `components/blog/`
2. **Add Features:** Extend API routes
3. **Configure Schedule:** Adjust cron expressions
4. **Optimize SEO:** Enhance metadata generation
5. **Add Analytics:** Integrate Google Analytics
6. **Setup Monitoring:** Add error tracking (Sentry)

---

## 📚 Additional Resources

- **Full Documentation:** `SYNTHPANEL_BLOG_GUIDE.md`
- **Code Reference:** `BACKEND_COMPLETE_CODE.md`
- **Database Setup:** `POSTGRES_SETUP.md`
- **Quick Reference:** `INDEX.md`

---

## 🎉 Congratulations!

You now have a fully functional AI-powered blog automation system!

**What you can do now:**
- Generate blog posts automatically
- Schedule publishing every 3 days
- Add citations and images automatically
- Optimize for SEO
- Scale to handle 1000s of posts

**Happy blogging! 🚀**
