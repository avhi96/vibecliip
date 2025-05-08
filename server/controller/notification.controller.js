import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.id; // assuming req.id is the logged-in user ID
    const notifications = await Notification.find({ toUser: userId })
      .populate('fromUser', 'username profilePicture')
      .populate({
        path: 'targetId',
        select: 'image',
        model: 'Post'
      })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};
