# 🗄️ POSTGRES SETUP GUIDE - SynthPanel

## 📋 Complete PostgreSQL Setup for SynthPanel Blog Automation

This guide covers PostgreSQL installation, configuration, and setup for both local development and cloud production environments.

---

## 🎯 What You'll Setup

- ✅ PostgreSQL 15+ installation
- ✅ Database creation and configuration
- ✅ User permissions and security
- ✅ Connection string setup
- ✅ Performance optimization
- ✅ Backup strategies

---

## 💻 Local Installation

### Docker (Recommended)

**Method 1: Using docker-compose (Easiest)**

1. Create a `docker-compose.yml` file with the content provided in `BACKEND_COMPLETE_CODE.md`.
2. Run the following command in your project root:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following credentials:
- **User:** `synthpanel`
- **Password:** `synthpanel_password`
- **Database:** `synthpanel`
- **Port:** `5432`

**Method 2: Manual Docker Run**

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name synthpanel-postgres \
  -e POSTGRES_PASSWORD=synthpanel_password \
  -e POSTGRES_USER=synthpanel \
  -e POSTGRES_DB=synthpanel \
  -p 5432:5432 \
  -v synthpanel-data:/var/lib/postgresql/data \
  -d postgres:15
```

### macOS / Linux (Alternative)

**Option 1: Homebrew (Recommended)**
```bash
# Update Homebrew
brew update

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
# Should show: psql (PostgreSQL) 15.x

# Connect to default database
psql postgres
```

**Option 2: Postgres.app**
1. Download from https://postgresapp.com/
2. Drag to Applications
3. Open and click "Initialize"
4. Add to PATH: `echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc`

---

### Windows (Alternative)

**Option 1: Official Installer**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer (choose latest version 15.x)
3. During installation:
   - Set superuser password (remember this!)
   - Port: 5432 (default)
   - Locale: Default
4. Verify: Open "SQL Shell (psql)" from Start menu

**Option 2: Windows Package Manager (winget)**
```powershell
# Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Verify
psql --version
```

**Option 3: Chocolatey**
```powershell
# Install Chocolatey first if not installed
choco install postgresql15

# Verify
psql --version
```

---

### Linux (Ubuntu/Debian) (Alternative)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version

# Check status
sudo systemctl status postgresql
```

---

## ☁️ Cloud Setup (Production)

### Supabase (Recommended - Free Tier Available)

**Benefits:**
- ✅ Free tier: 500MB database
- ✅ Automatic backups
- ✅ Built-in API
- ✅ Real-time subscriptions
- ✅ Easy to use dashboard

**Setup:**
1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Project name: `synthpanel-blog`
   - Database password: (strong password)
   - Region: (closest to users)
5. Wait for project creation (~2 minutes)
6. Get connection string:
   - Settings → Database
   - Copy "Connection String" (URI format)
   - Example: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Connection String:**
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

---

### Railway (Free Tier Available)

**Benefits:**
- ✅ Free tier: $5/month credit
- ✅ Easy deployment
- ✅ Automatic scaling
- ✅ Built-in monitoring

**Setup:**
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy PostgreSQL
4. Click on PostgreSQL service
5. Variables tab → Copy `DATABASE_URL`

**Connection String:**
```bash
DATABASE_URL="postgresql://postgres:PASSWORD@containers-us-west-xxx.railway.app:5432/railway"
```

---

### Neon (Serverless PostgreSQL)

**Benefits:**
- ✅ Free tier: 3GB storage
- ✅ Serverless (auto-scaling)
- ✅ Branching (like Git)
- ✅ Fast cold starts

**Setup:**
1. Go to https://neon.tech
2. Sign up
3. Create project
4. Copy connection string from dashboard

**Connection String:**
```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

---

### AWS RDS (Enterprise)

**Setup:**
1. AWS Console → RDS
2. Create database
3. Choose PostgreSQL 15
4. Configuration:
   - Template: Free tier / Production
   - DB instance: db.t3.micro (free tier)
   - Storage: 20GB
   - VPC: Default
   - Public access: Yes (for development)
5. Set master password
6. Create database
7. Wait ~5 minutes
8. Get endpoint from RDS dashboard

**Connection String:**
```bash
DATABASE_URL="postgresql://admin:password@database-1.xxxxx.us-east-1.rds.amazonaws.com:5432/synthpanel"
```

---

## 🔧 Configuration

### Create Database

**Local PostgreSQL:**
```bash
# Connect as postgres user
psql postgres

# Create database
CREATE DATABASE synthpanel;

# Create user (optional)
CREATE USER synthpanel_user WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE synthpanel TO synthpanel_user;

# Exit
\q
```

**Or using createdb command:**
```bash
createdb synthpanel
```

---

### Configure Connection

**Connection String Format:**
```
postgresql://[user[:password]@][host][:port][/database][?parameters]
```

**Examples:**

**Local (default user):**
```bash
DATABASE_URL="postgresql://localhost:5432/synthpanel"
```

**Local (custom user):**
```bash
DATABASE_URL="postgresql://synthpanel_user:secure_password@localhost:5432/synthpanel"
```

**Cloud:**
```bash
DATABASE_URL="postgresql://user:password@host.provider.com:5432/database"
```

**With SSL (required for most cloud providers):**
```bash
DATABASE_URL="postgresql://user:password@host.com:5432/db?sslmode=require"
```

---

### Test Connection

**Using psql:**
```bash
psql $DATABASE_URL

# Or
psql "postgresql://user:pass@host:5432/db"

# If successful, you'll see:
# psql (15.x)
# Type "help" for help.
# 
# database=#
```

**Using Node.js / Bun:**

Create `test-connection.ts`:
```typescript
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log('✅ Connected to PostgreSQL');
    console.log('Version:', result[0].version);
    await sql.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run:
```bash
bun run test-connection.ts
```

---

## 🔐 Security Setup

### Create Application User

```sql
-- Connect as superuser
psql postgres

-- Create user
CREATE USER synthpanel_app WITH PASSWORD 'strong_random_password';

-- Create database
CREATE DATABASE synthpanel OWNER synthpanel_app;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE synthpanel TO synthpanel_app;

-- Connect to new database
\c synthpanel

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO synthpanel_app;
```

### Enable SSL (Production)

**PostgreSQL Config (`postgresql.conf`):**
```conf
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
ssl_ca_file = '/path/to/root.crt'
```

**Connection String with SSL:**
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
# or
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=verify-full"
```

---

## ⚡ Performance Optimization

### Recommended Settings

**For Development (small datasets):**
```sql
-- postgresql.conf
shared_buffers = 128MB
effective_cache_size = 512MB
maintenance_work_mem = 64MB
work_mem = 4MB
```

**For Production (medium workload):**
```sql
-- postgresql.conf
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB       # 50-75% of RAM
maintenance_work_mem = 128MB
work_mem = 16MB
max_connections = 100
```

### Create Indexes

Indexes are included in the migration, but here's what they do:

```sql
-- Included in migrations/0000_initial.sql

CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_published_at_idx ON posts(published_at);
CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX citations_post_id_idx ON citations(post_id);
```

---

## 💾 Backup and Restore

### Backup Database

**Full Backup:**
```bash
# Local
pg_dump synthpanel > backup.sql

# Remote
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compressed
pg_dump synthpanel | gzip > backup.sql.gz
```

**Schema Only:**
```bash
pg_dump --schema-only synthpanel > schema.sql
```

**Data Only:**
```bash
pg_dump --data-only synthpanel > data.sql
```

### Restore Database

```bash
# From SQL file
psql synthpanel < backup.sql

# From compressed
gunzip -c backup.sql.gz | psql synthpanel

# Remote
psql $DATABASE_URL < backup.sql
```

### Automated Backups

**Create backup script** (`backup.sh`):
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups/synthpanel"
mkdir -p $BACKUP_DIR

pg_dump synthpanel | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

**Schedule with cron:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 🛠️ Common Commands

### Database Management

```sql
-- List databases
\l

-- Connect to database
\c synthpanel

-- List tables
\dt

-- Describe table
\d posts

-- List indexes
\di

-- Show database size
SELECT pg_size_pretty(pg_database_size('synthpanel'));

-- Show table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::text))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

### User Management

```sql
-- List users
\du

-- Change password
ALTER USER synthpanel_app WITH PASSWORD 'new_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO synthpanel_app;
```

---

## 🐛 Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS
docker ps                        # Docker

# Check port
sudo lsof -i :5432   # macOS/Linux
netstat -an | find "5432"  # Windows
```

### Authentication Failed

```bash
# Check pg_hba.conf
# Location varies by system:
# macOS: /opt/homebrew/var/postgresql@15/pg_hba.conf
# Linux: /etc/postgresql/15/main/pg_hba.conf

# Add this line for local development:
host    all             all             127.0.0.1/32            md5
```

### Out of Connections

```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < current_timestamp - INTERVAL '5 minutes';

-- Increase max connections (postgresql.conf)
max_connections = 200
```

### Slow Queries

```sql
-- Enable query logging (postgresql.conf)
log_min_duration_statement = 1000  # Log queries > 1 second

-- Find slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## ✅ Setup Verification Checklist

After setup, verify:

- [ ] PostgreSQL is running
- [ ] Database created successfully
- [ ] Can connect with connection string
- [ ] User has correct permissions
- [ ] Tables can be created
- [ ] Indexes are working
- [ ] Backups are configured (production)
- [ ] SSL is enabled (production)

---

## 📚 Additional Resources

- **Official Docs:** https://www.postgresql.org/docs/
- **Supabase Docs:** https://supabase.com/docs
- **Railway Docs:** https://docs.railway.app
- **Neon Docs:** https://neon.tech/docs
- **Performance Tuning:** https://wiki.postgresql.org/wiki/Performance_Optimization

---

## 🎉 Next Steps

Once PostgreSQL is setup:

1. ✅ Return to `QUICK_START_GUIDE.md`
2. ✅ Run database migrations
3. ✅ Seed initial data
4. ✅ Test the application

**Your database is ready! 🚀**
