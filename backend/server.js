const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { saveUser, getUsers, getUser, updateUser, deleteUser, getFile } = require('./controllers/user_controller');
const { savePublication, getPublication, deletePublication } = require('./controllers/publication_controller');
const { saveUserSignup, signin } = require('./controllers/userSignup_controller');
const { uploadBasic, getGoogleDriveFiles, downloadFile } = require('./upload');

const app = express();

//Middleware for parsing json and url-encoded bodies
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
//app.use(cors({ origin: 'https://faculty.thegorun.com' }));
app.use(cors({ origin: '*' }));

//Connect to mongodb

//mongoose.connect('mongodb://localhost:27017/FacultyDB',{
mongoose.connect('mongodb+srv://gmukul545:Mukulgupta%4013102001@facultydb.aahskmv.mongodb.net/?retryWrites=true&w=majority&appName=FacultyDB',{
   // useNewUrlParser: true,
   // useUnifiedTopology: true,
})
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('Connection error:',err));

app.post('/saveUser',saveUser);
app.post('/savePublication',savePublication);
app.post('/signup',saveUserSignup);
app.put('/saveUser/:userId',updateUser);
app.delete('/deleteUser/:userId',deleteUser);
app.delete('/deletePublication/:id',deletePublication);
app.post('/signin',signin);
app.get('/getUser',getUsers);
app.get('/getUser/:userId',getUser);
app.get('/getPublication/:userId',getPublication);
app.get('/getfile/:file', getFile);
app.post('/upload/:uploadType',uploadBasic);
app.get('/googledrives',getGoogleDriveFiles);
app.get('/downloadFile/:fileId',downloadFile);
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function(req,file,cb)
//         {
//             cb(null,"uploads");
//         },
//         filename: function(req, file,cb){
//             cb(null,file.fieldname + "-" + Date.now() + ".jpg")
//         }
//     })
// }).single("user_file");
// app.post('/upload',upload, (req, res) => {
//     res.send("file upload");
// });

// Start the Server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
