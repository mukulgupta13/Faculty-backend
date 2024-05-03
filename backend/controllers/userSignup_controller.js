const UserSignup = require("../models/userSignup");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const saveUserSignup = async (req, res) => {
    try {
        // Validation can be done here
        
        const { username, password, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user instance with hashed password
        const user = await UserSignup.create({ username, password: hashedPassword, role });

        return res.status(200).json({
            message: "Success",
            data: user,
        });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: "Failed to save user" });
    }
};


const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await UserSignup.findOne({ username });
        console.log('user.....',user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const userDetails = await User.findOne({email: username});
        const jwtObj = { username: user.username, id: user._id, role: user.role };
        if(userDetails){
            jwtObj.user_id = userDetails._id;
        }
        // Create and send token
        const token = jwt.sign(jwtObj, 'secret', { expiresIn: '1h' });
        res.status(200).json({ message: "Success", data: user, token:token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    saveUserSignup,
    signin
};
