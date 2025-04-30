import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing", success: false });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token", success: false });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      return res.status(200).json({
        success: true,
        token: accessToken,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
