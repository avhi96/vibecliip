import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);
