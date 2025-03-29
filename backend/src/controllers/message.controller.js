import User from "../models/user.model.js"

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

}