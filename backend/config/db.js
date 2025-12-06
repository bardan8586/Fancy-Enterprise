const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        // Use local MongoDB if LOCAL_MONGODB is set to true
        const mongoURI = process.env.LOCAL_MONGODB === "true" 
            ? "mongodb://localhost:27017/ecommerce"
            : process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        
        await mongoose.connect(mongoURI);
        const dbName = mongoURI.includes("localhost") ? "local MongoDB" : "MongoDB Atlas";
        console.log(`${dbName} connected successfully`);
    } catch(err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

module.exports = connectDB;