import { db, users, stories, comments, votes } from './index.js';

async function reset() {
    console.log('🗑️  Resetting database...');

    try {
        // Delete all data in reverse dependency order
        await db.delete(votes);
        await db.delete(comments);
        await db.delete(stories);
        await db.delete(users);

        console.log('✅ Database cleared!');
        process.exit(0);
    } catch (error) {
        // If tables don't exist or other error, just exit
        console.warn('⚠️  Warning during reset:', error.message);
        process.exit(0);
    }
}

reset().catch((error) => {
    console.error('❌ Reset failed:', error);
    process.exit(1);
});
