import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) =>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d",
  });

  res.cookie("jwt",token,{
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,//prevents XXS attacks
    sameSite:"Strict",//prevents CSRF attacks
    secure:process.env.NODE_ENV !== "development",
  });
};