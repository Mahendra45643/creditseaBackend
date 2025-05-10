// server/src/server.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import config from "./config/config";

// Load environment variables
dotenv.config();

// Create HTTP server
const server = http.createServer(app);

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// Function to gracefully shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} signal received: closing HTTP server`);

  server.close(async () => {
    console.log("HTTP server closed");

    // Close database connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    process.exit(0);
  });
};

// Function to start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the server
    server.listen(PORT, () => {
      console.log("========================================");
      console.log(`🚀 Server running in ${NODE_ENV} mode`);
      console.log(`🔊 Listening on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🗄️  MongoDB connected successfully`);
      console.log("========================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`Error: ${err.message}`);
  console.error("Unhandled Promise Rejection! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default server;
