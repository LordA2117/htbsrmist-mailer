import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState) {
    console.log("Already connected");
    return;
  }

  try {
    const URL = process.env.NEXT_PUBLIC_MONGODB_URI || "mongodb://localhost:27017/";
    const dbName = process.env.DB_NAME || "mailer";
    
    // Construct MongoDB URI with the database name
    const mongoURI = `${URL}${dbName}`;

    await mongoose.connect(mongoURI);

    console.log("Connected Successfully");
  } catch (err) {
    console.error("Connection error", err);
    throw err;
  }
};

export default connectDB;
