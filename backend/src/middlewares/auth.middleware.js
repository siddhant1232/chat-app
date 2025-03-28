import jwt, { verify } from "jsonwebtoken";
import User from "../models/user.model";

export const privateRoute = async (req,res) =>{
  try {
    const token = req.cookies.jwt;

    if(!token){
      return res.status(400).json({message:'token required'})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return res.status(400).json({message:'invalid token'})
    }

    const user = await User.findById(decoded.userid).select("-password")
    if (!user){
      return res.status(400).json({message:'user not found'})
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('error in privateRoute middleware',error.message);
    res.status(500).json({message:"internal server error"})
  }

};
