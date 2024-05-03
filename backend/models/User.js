const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
    },
    userName: {
        type: String,
        reqired: true,
        maxLength: 256,
    },
    designation: {
        type: String,
    },
    image: {
        type: String,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);
