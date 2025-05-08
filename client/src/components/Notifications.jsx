import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/notifications');
        if (res.data && res.data.success) {
          setNotifications(res.data.notifications);
        } else {
          setError('Failed to load notifications');
        }
      } catch (err) {
        setError('Error loading notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [axiosInstance]);

  if (loading) return <p className="p-4 text-white">Loading notifications...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (notifications.length === 0) return <p className="p-4 text-white">No notifications yet.</p>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id || notif.id} className="mb-3 border-b border-gray-700 pb-2 flex items-center gap-3">
            {(notif.type === 'like' || notif.type === 'comment') && notif.targetId?.image && (
              <img src={notif.targetId.image} alt="post thumbnail" className="w-8 h-8 rounded object-cover" />
            )}
            <div>
              <p>
                {notif.type === 'like' && (
                  <>
                    <strong>{notif.fromUser?.username || 'Someone'}</strong> liked your {notif.targetType}.
                  </>
                )}
                {notif.type === 'follow' && (
                  <>
                    <strong>{notif.fromUser?.username || 'Someone'}</strong> started following you.
                  </>
                )}
                {notif.type === 'comment' && (
                  <>
                    <strong>{notif.fromUser?.username || 'Someone'}</strong> commented on your post.
                  </>
                )}
              </p>
              <p className="text-gray-400 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
