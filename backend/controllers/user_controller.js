const User = require("../models/User");
const multer = require('multer');
const exts = ['jpeg','png','pdf'];
const extName = ['.jpg','.png','.pdf'];
const { uploadAndGetFileId } = require('./../upload');
const getUsers = async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    message: "Success",
    data: users,
  });
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const upload = multer({
  storage: multer.diskStorage({
      destination: function(req,file,cb)
      {
          cb(null,"uploads");
      },
      filename: function(req, file,cb){
        const extension = file.mimetype.split("/")[1];
        const idx = exts.indexOf(extension);
        let ext = "";
        if(idx > -1){
          ext = extName[idx];
        }
        cb(null,file.fieldname + "-" + Date.now() + ext)
      }
  })
}).single("image");
const upload2 = multer().single("image");

const saveUser = async (req, res, next) => {
  upload2(req, res, async (err, b, c)=>{
    if(err)
    {
      return next(err);
    }
    console.log(req.body);
    //const {image} = req.params;
    const data = req.body;
    if (req.file) {
      console.log(req.file);
      data.image = await uploadAndGetFileId(req.file);
      console.log(data.image);
      //data.image = req.file.path;
    }
    const user = await User.create(data);
    return res.status(200).json({
        message: "Success",
        data: user,
    });

  })
    // console.log(req.body);
    // const userInDb = await User.findOne({
    //     userId: req.body.userId,
    // });
    // console.log(userInDb);
    // if (userInDb) {
    //     return res.status(200).json({
    //         message: "User Already Exists",
    //     });
    // }
  
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  upload(req, res, async (err, b, c)=>{
    if(err)
    {
      return next(err);
    }
    console.log(req.body);
    //const {image} = req.params;
    const data = req.body;
    if (req.file) {
      
      data.image = req.file.path;
    }
    const user = await User.findOneAndUpdate({ _id: userId }, req.body);
    return res.status(200).json({
      message: "Success",
      data: user,
    });

  })
  
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndDelete({_id: userId});

    if (!user) {
      // If the user doesn't exist or has already been deleted
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Successfully deleted the user
    return res.status(200).json({
      message: "Success",
      data: user, // Consider the implications of sending back deleted user data
    });
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    return next(error);
  }
}

const getFile = async(req, res)=>{
  return res.sendFile('\\uploads\\'+req.params.file);
}
module.exports = {
      getUsers,
      getUser,
      saveUser,
      updateUser,
      deleteUser,
      getFile
};
