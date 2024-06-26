const { useParams } = require("react-router-dom");
const Publication = require("../models/Publications");
const multer = require('multer');

const { uploadAndGetFileId } = require('./../upload');

const uploadPDF = multer().single("publishPdf");

const getPublication = async (req, res) => {
    try {
        const { userId } = req.params;
        //const userId = req.userId;
        console.log(userId);
        const publication = await Publication.find({ userId: userId });

        return res.status(200).json({
            message: "Success",
            data: publication,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const savePublication = async (req, res) => {
  uploadPDF(req, res, async (err, b, c)=>{
    if(err)
    {
      return next(err);
    }
    console.log(req.body);
    const data = req.body;
    if (req.file) {
      console.log(req.file);
      data.publishPdf = await uploadAndGetFileId(req.file);
      console.log(data.publishPdf);
      //data.image = req.file.path;
    }
    const publication = await Publication.create(data);
    return res.status(200).json({
        message: "Success",
        data: publication,
    });
  });
};
const deletePublication = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const publication = await Publication.findOneAndDelete({_id: id});
      console.log('publication',publication);
  
      if (!publication) {
        // If the user doesn't exist or has already been deleted
        return res.status(404).json({
          message: "Publication not found",
        });
      }
  
      // Successfully deleted the user
      return res.status(200).json({
        message: "Success",
        data: publication, // Consider the implications of sending back deleted user data
      });
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      return next(error);
    }
  }

const uploadFile = (req,res) =>{
  res.send("file upload");
}
module.exports = {
    getPublication,
    savePublication,
    deletePublication
};
