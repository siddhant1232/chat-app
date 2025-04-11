import mongoose from "mongoose";
import User from "./user.model.js";

const messageSchema = new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.ObjectId,
    ref:User,
    required:true,
  },
  receiverId:{
    type:mongoose.Schema.ObjectId,
    ref:User,
    required:true,
  },
  text:{
    type:String,
  },
  image:{
    type:String,
  },
},
  {timestamps:true},
);

const message = mongoose.model("message",messageSchema);
export default message;