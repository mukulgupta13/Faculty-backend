const mongoose = require("mongoose");
const publicationSchema = new mongoose.Schema({
    publicationTitle: {
        type: String,
    },
    year: {
        type: String, 
    },
    publicationLink: {
        type: String,
    },
    publishPdf: {
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
    userId: {
        type: String,
    }
});

publicationSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Publication", publicationSchema);
