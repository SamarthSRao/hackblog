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
