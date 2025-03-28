import express from "express";
import authroutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/auth', authroutes);

app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
  connectDB();
})