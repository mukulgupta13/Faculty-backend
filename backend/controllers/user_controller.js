const User = require("../models/User");

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
const saveUser = async (req, res) => {
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
    console.log(req.body);
    const user = await User.create(req.body);
    return res.status(200).json({
        message: "Success",
        data: user,
    });
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body);
  return res.status(200).json({
    message: "Success",
    data: user,
  });
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


module.exports = {
      getUsers,
      getUser,
      saveUser,
      updateUser,
      deleteUser
};
