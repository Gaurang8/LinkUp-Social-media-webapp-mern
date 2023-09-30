import React, { useEffect, useState } from "react";

import { useContext } from "react";
import { MyContext } from "../MyContext";
import CloseIcon from '@mui/icons-material/Close';
import "./css/notification.css";

const Notifications = ({close}) => {
  const { user } = useContext(MyContext);

  const [notifications, setNotifications] = useState(user?.notifications || []);

  useEffect(() => {
    setNotifications(user?.notifications || []);
  }, [user]);

  return (
    <div className="notification-main">
      <div className="notification-header">
        <span>Notifications</span>
        <span onClick={close}><CloseIcon/></span>
      </div>
      <div className="notification-body">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => {
            return (
              <div className="notification-body-item">
                <div className="notification-user-icon" key={notification._id}>
                  <img src="https://picsum.photos/30/30" alt="user" />
                </div>
                <div className="notification-message">
                  <span>{notification.senderName}</span> {notification.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
