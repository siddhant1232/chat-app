import mongoose from 'mongoose';

export const connectDB = async (req,res) =>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongo connected')
  }
  catch(error){
    console.log("error conecting mongodb",error);
  }
};

