const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveUser, getUsers, getUser, updateUser, deleteUser } = require('./controllers/user_controller');
const { savePublication, getPublication, deletePublication } = require('./controllers/publication_controller');
const { saveUserSignup, signin } = require('./controllers/userSignup_controller');

const app = express();

//Middleware for parsing json and url-encoded bodies
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(cors({ origin: 'http://localhost:3000' }));

//Connect to mongodb

mongoose.connect('mongodb://localhost:27017/FacultyDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

// Start the Server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});