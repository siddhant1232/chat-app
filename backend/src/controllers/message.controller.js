import User from "../models/user.model.js"
import Message from '../models/message.models.js'

export const getUsersForSidebar = async (req,res)=>{  
  try {
    const loggedInUser = req.User._id;
    const filetreredUser = await User.find({_id:{loggedInUser}}).select('-password');

    res.status(200).json(filetreredUser);
  } catch (error) {
    console.log('error in getUsersForSidebar controller',error.messsage);
    res.status(500).json({messsage:'internal server error'});
  }
}
export const getAllmessages = async (req,res)=>{
  try {
    const {id:chatWithUserId} = req.params;
    const myId = req.User._id;

    const messages = await Message.find({
      $or:[
        {senderId:myId , recieverId : chatWithUserId},
        {senderId: chatWithUserId , recieverId: myId},
      ]
    });

    res.status(200).json(messages)
  } catch (error) {
    console.log('error in getallmessage controller',error.messsage);
    res.status(500).json({messsage:'internal server error'});
  }
}

export const sendMessage = async (req,res) =>{
 try {
  const {text,image} = req.body;
  console.log(req.body); 

  const {id:recieverId} = req.params;
  const senderId = req.User._id;

  let imageUrl;
  if(image){
    const uploadresponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadresponse.secure_url;
  }

  const newMessage = new Message({
    senderId,recieverId,text,image:imageUrl,
  });

  await newMessage.save();

  res.status(201).json(newMessage);
 } catch (error) {
  console.log('error in sendMessage controller',error.message);
  res.status(500).json({message:'Internal server error'});
 }
}
  