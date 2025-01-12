import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        unique: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Quote = mongoose.model("quotes", quoteSchema);
export default Quote;