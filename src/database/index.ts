import mongoose from 'mongoose';

export const connectDB = () => {
  const dbUri = process.env.DATABASE_URL || '';

  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(dbUri, {
      retryWrites: true,
      w: 'majority',
    });
    // console.log('Connected to Db');
    console.log('\x1b[35m%s\x1b[0m', 'Connected to Db');

    mongoose.connection.on('disconnected', () => {
      console.log('🚨 Mongoose lost connection to the database!');
    });

    // await mongoose.connect(process.env.MONGO_URI, {
    //   bufferCommands: false,           // Stop buffering; fail immediately if connection is bad
    //   serverSelectionTimeoutMS: 5000,   // Cut the wait time to 5 seconds
    // });
  } catch (err) {
    console.error("Couldn't connect to Db:", err);
    process.exit(1);
  }
};
