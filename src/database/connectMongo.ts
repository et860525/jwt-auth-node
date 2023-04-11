import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const db_user = process.env.MONGODB_USERNAME;
const db_pwd = process.env.MONGODB_PASSWORD;
const db_name = process.env.MONGODB_DATABASE;

mongoose.set('strictQuery', false);
const url = `mongodb://${db_user}:${db_pwd}@localhost:6017/${db_name}`;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Database connected...');
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
