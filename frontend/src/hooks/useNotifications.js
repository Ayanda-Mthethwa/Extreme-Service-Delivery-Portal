import { useState, useEffect } from 'react';
import { getNotifications, deleteNotification } from '../services/reportService';

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    getNotifications(userId)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Error fetching notifications:', err));
  }, [userId]);

  const removeNotification = async (id) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, setNotifications, unreadCount, removeNotification };
};

export default useNotifications;
