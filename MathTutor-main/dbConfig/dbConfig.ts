import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL!);

        isConnected = true;

        // Ensure event listeners are not duplicated
        mongoose.connection.removeAllListeners("error");

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            isConnected = false; // Mark as disconnected
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}
