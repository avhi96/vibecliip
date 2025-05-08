import { User } from '../models/user.model.js';
import { Post } from "../models/post.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  },
});

export const getCurrentUser = async (req, res) => {
try {
  const userId = req.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required.",
      success: false,
    });
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
      success: false,
    });
  }

  return res.status(200).json({
    user,
    success: true,
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({
    message: "Server error",
    success: false,
  });
}
}; 

export const register = async (req, res) => {
  try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
          return res.status(401).json({
              message: "Something is missing, please check!",
              success: false,
          });
      }
      const user = await User.findOne({ email });
      if (user) {
          return res.status(401).json({
              message: "Try different email",
              success: false,
          });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
          username,
          email,
          password: hashedPassword
      });
      return res.status(201).json({
          message: "Account created successfully.",
          success: true,
      });
  } catch (error) {
      console.log(error);
  }
}

export const login = async (req, res) => {
try {
  const { email, password, idToken } = req.body;

  if (idToken) {
    // Firebase social login flow
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const firebaseEmail = decodedToken.email;

    let user = await User.findOne({ email: firebaseEmail });

    if (!user) {
      // Create new user if not exists
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        username: firebaseEmail.split('@')[0],
        email: firebaseEmail,
        password: hashedPassword,
      });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables");
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
      token: accessToken,
    });
  } else {
    // Traditional email/password login flow
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables");
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
      token: accessToken,
    });
  }
} catch (error) {
  console.log(error);
  return res.status(500).json({ message: "Server error", success: false });
}
};


export const editProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
      let cloudResponse;

      if (profilePicture) {
          const fileUri = getDataUri(profilePicture);
          cloudResponse = await cloudinary.uploader.upload(fileUri);
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({
              message: 'User not found.',
              success: false
          });
      };
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePicture) user.profilePicture = cloudResponse.secure_url;

      await user.save();

      return res.status(200).json({
          message: 'Profile updated.',
          success: true,
          user
      });

  } catch (error) {
      console.log(error);
  }
};


export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        success: false,
      });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password reset email sent.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
        success: false,
      });
    }

    // Search users by username or email containing the query string (case-insensitive)
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = async (_, res) => {
  try {
      return res.cookie("refreshToken", "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' }).json({
          message: 'Logged out successfully.',
          success: true
      });
  } catch (error) {
      console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
      const userId = req.params.id;
      let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
      return res.status(200).json({
          user,
          success: true
      });
  } catch (error) {
      console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
      const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json({
          success: true,
          users: suggestedUsers
      })
  } catch (error) {
      console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
      const followKrneWala = req.id; // patel
      const jiskoFollowKrunga = req.params.id; // shivani
      if (followKrneWala === jiskoFollowKrunga) {
          return res.status(400).json({
              message: 'You cannot follow/unfollow yourself',
              success: false
          });
      }

      const user = await User.findById(followKrneWala);
      const targetUser = await User.findById(jiskoFollowKrunga);

      if (!user || !targetUser) {
          return res.status(400).json({
              message: 'User not found',
              success: false
          });
      }
      // mai check krunga ki follow krna hai ya unfollow
      const isFollowing = user.following.includes(jiskoFollowKrunga);
      if (isFollowing) {
          // unfollow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'Unfollowed successfully', success: true });
      } else {
          // follow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'followed successfully', success: true });
      }
  } catch (error) {
      console.log(error);
  }
};
