import express from "express";
import authroutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageroutes from "./routes/message.route.js"


dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authroutes);
app.use('/api/message',messageroutes)

app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
  connectDB();
})