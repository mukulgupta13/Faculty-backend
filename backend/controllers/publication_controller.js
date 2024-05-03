const { useParams } = require("react-router-dom");
const Publication = require("../models/Publications");


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
    console.log(req.body);
    const publication = await Publication.create(req.body);
    return res.status(200).json({
        message: "Success",
        data: publication,
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

// const updateEmployee = async (req, res, next) => {
//   const { id } = req.params;
//   const employee = await Employee.findOneAndUpdate({ firstname: id }, req.body);
//   return res.status(200).json({
//     message: "Success",
//     data: employee,
//   });
// };

// const deleteEmployee = async (req, res, next) => {
//   const { id } = req.params;
//   const empAsPrjOwner = await Project.findOne({ "owner": id });
//   const empInTeam = await Team.findOne({
//     $or: [{ "owner": id }, { "members": id }],
//   });
//   if(empAsPrjOwner || empInTeam){
//     return res.status(200).json({
//       status: "Fail",
//       message: "Employee is exist in projects or teams.",
//     });
//   }
//   const employee = await Employee.findOneAndDelete({ _id: id });
//   return res.status(200).json({
//     status: "Success",
//     message: `Employee '${[employee.firstname, employee.lastname].join(' ')}' is deleted successfully.`,
//   });
// };
module.exports = {
    getPublication,
    savePublication,
    deletePublication
    //   updateEmployee,
    //   deleteEmployee,
};
