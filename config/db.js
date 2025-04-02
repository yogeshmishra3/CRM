
const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Dogesh", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
