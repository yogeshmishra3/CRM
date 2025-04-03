
const mongoose = require('mongoose');
require('dotenv').config();
// MongoDB Connection String
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Create indexes for better performance if they don't exist
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.includes('drafts')) {
            const Draft = mongoose.model('Draft');
            await Draft.collection.createIndex({ fromEmail: 1 });
            await Draft.collection.createIndex({ createdAt: 1 });
        }
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
