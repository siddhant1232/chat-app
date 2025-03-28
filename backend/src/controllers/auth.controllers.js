import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../lib/utils.js";


export const signup = async(req,res)=>{
  const{email,fullname,password} = req.body;
 
  try {
    if(!email || !fullname || !password ){
      return res.status(400).json({message : 'all the fields are required'});
    }
    // Check the password length
    if(password.length < 6){
      return res.status(400).json({message : 'password must be of 6 characters'});
    }
    // Check if the user already exist or not
    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:'user already exists'})
    
      // Generates a salt using Bcrypt
    const salt = await bcrypt.genSalt(10);
    // Generates A Hashed Password using Bcrypt
    const hashedPassword = await bcrypt.hash(password,salt);

    // Create a new user and taking hashed password
    const newUser = new User ({
      email,
      fullname,
      password:hashedPassword,
    });
    await newUser.save();

    // If user exists, it Generates a JWT token for The user and Gives cookies as the response
    if(newUser){
      generateToken(newUser._id,res);
      
      res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email,
        profilepic:newUser.profilepic,
      });

    }else{
      return res.status(400).json({message:"invalid user data"})
    }

  } 
  catch (error) {
    console.log("signup controller error",error.message);
    res.status(500).json({message:"internal server error"});
  }
};

export const signin = async (req,res) =>{
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"invalid credentials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message:'Invalid credentials'})
    }

    generateToken(user._id,res);

    res.status(200).json({
      _id:user._id,
      fullname:user.fullname,
      email:user.email,
      profilepic:user.profilepic,
    })
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
    console.log("error in the login controller",error.message);
  }
};

export const logout = (req,res) =>{
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:'logout successfull'})
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
    console.log("error in the logout controller",error.message);
  }
};

export const updateProfile = async (req,res)=>{
  try {
    const {profilepic} = req.body;
    const userId = req.user._id;

    if(!profilepic){
      return res.status(400).json({message:"profilepic is required"});
    }

    const upload = await cloudinary.uploader.upload(profilepic);
    const updateUser = await User.findByIdAndUpdate(userId,{profilepic:upload.secure_url},{new:true})

    res.status(200).json({message:'profile-pic updated successfully'})

  } catch (error) {
    res.status(500).json({message:'Internal server error'})
    console.log('update-profile controller error')
  }
}