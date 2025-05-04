import sharp from "sharp";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js"

export const addNewPost = async (req, res) => {
    try {
      const { title, caption } = req.body;
      const image = req.file;
      const authorId = req.id;
  
      if (!image) {
        return res.status(400).json({
          message: "Please upload an image.",
          success: false,
        });
      }
  
      // image upload
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: "inside",
          position: "center",
        })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
  
      // buffer to data uri
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
  
      const post = await Post.create({
        title,
        caption,
        image: cloudResponse.secure_url,
        author: authorId,
      });
  
      const user = await User.findById(authorId);
      if (user) {
        user.posts.push(post._id);
        await user.save();
      }
  
      await post.populate({ path: "author", select: "-password" });
      return res.status(201).json({
        message: "Post created successfully.",
        post,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error: " + error.message,
        success: false,
      });
    }
  };
  

// rest of the file unchanged
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};

// other exports unchanged
export const addComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({
            post: postId,
            author: authorId,
            text,
        });

        post.comments.push(comment._id);
        await post.save();

        await comment.populate({ path: 'author', select: 'username profilePicture' });

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};


// In post.controller.js

export const bookmarkPost = async (req, res) => {
    try {
        const userId = req.id;
        const { postId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyBookmarked = user.bookmarks.includes(postId);

        if (alreadyBookmarked) {
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
            await user.save();
            return res.status(200).json({
                message: "Bookmark removed",
                success: true
            });
        } else {
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({
                message: "Post bookmarked",
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};

// In post.controller.js

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        if (!post.author || post.author.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized", success: false });
        }

        // Remove post reference from user's posts array
        const user = await User.findById(userId);
        user.posts = user.posts.filter(postId => postId.toString() !== id);
        await user.save();

        // Optionally delete comments related to this post
        await Comment.deleteMany({ post: id });

        await post.deleteOne();

        return res.status(200).json({ message: "Post deleted successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};


export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const hasLiked = post.likes.includes(userId);
        const hasDisliked = post.dislikes.includes(userId);

        if (hasLiked) {
            post.likes.pull(userId); // remove like
        } else {
            post.likes.push(userId);
            if (hasDisliked) {
                post.dislikes.pull(userId); // remove dislike if already disliked
            }
        }

        await post.save();

        return res.status(200).json({
            message: hasLiked ? "Like removed" : "Post liked",
            success: true,
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};


export const dislikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const hasDisliked = post.dislikes.includes(userId);
        const hasLiked = post.likes.includes(userId);

        if (hasDisliked) {
            post.dislikes.pull(userId); // remove dislike
        } else {
            post.dislikes.push(userId);
            if (hasLiked) {
                post.likes.pull(userId); // remove like if already liked
            }
        }

        await post.save();

        return res.status(200).json({
            message: hasDisliked ? "Dislike removed" : "Post disliked",
            success: true,
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id).populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username profilePicture'
            },
            options: { sort: { createdAt: -1 } } // Sort descending to have latest comment on top
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        return res.status(200).json({
            comments: post.comments,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};



export const getUserPost = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            posts,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error: " + error.message,
            success: false
        });
    }
};
