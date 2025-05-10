// server/src/config/db.ts
import mongoose from 'mongoose';
import config from './config';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.MONGO_URI;
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;