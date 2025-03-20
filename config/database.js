const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB");
        return;
    };

    if (process.env.NODE_ENV === "test") {
        console.log("Skipping database connection in test environment");
        return;
    };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    };
};

module.exports = connectDB;