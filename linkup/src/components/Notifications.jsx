import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useContext } from "react";
import { MyContext } from "../MyContext";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

const Notifications = () => {
  const { user } = useContext(MyContext);

  const [notifications, setNotifications] = useState(user?.notifications);

  useEffect(() => {
    console.log("user is ", user?.notifications)
    setNotifications(user?.notifications);
  }, [user]);

  useEffect(() => {
    socket.on("sendNotification", (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    return () => {
      socket.off("sendNotification");
    };
  }, []);

  return (
    <div>
      {notifications?.length > 0 &&
        notifications.map((notification) => (
          <div key={notification._id}>
            <p>{notification.senderName}</p>
            <p>{notification.message}</p>
          </div>
        ))}
    </div>
  );
};

export default Notifications;
