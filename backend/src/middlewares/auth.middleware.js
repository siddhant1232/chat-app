// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
const {verify} = jwt
import User from "../models/user.model.js";

export const privateRoute = async (req,res,next) =>{
  try {
    const token = req.cookies.jwt;

    if(!token){
      return res.status(400).json({message:'token required'})
    }

    const decoded = verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return res.status(400).json({message:'invalid token'})
    }

    const user = await User.findById(decoded.userId).select("-password")
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

// export const privateRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     console.log("Token received:", token);

//     if (!token) {
//       return res.status(400).json({ message: "Token required" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);

//     if (!decoded) {
//       return res.status(400).json({ message: "Invalid token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");
//     console.log("User found:", user);

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("Error in privateRoute middleware:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
