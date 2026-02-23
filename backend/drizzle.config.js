import 'dotenv/config';

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
