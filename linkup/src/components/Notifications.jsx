import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
import { useContext } from "react";
import { MyContext } from "../MyContext";

// const socket = io("http://localhost:8000");

// console.log("socket is ", socket);

// socket.on("connect", () => {
//   console.log("Connected to the WebSocket server");
// });

// Event handler for connection errors.
// socket.on("connect_error", (error) => {
//   console.error("WebSocket connection error:", error);
// });

const Notifications = () => {

  const { user } = useContext(MyContext);

  const [notifications, setNotifications] = useState(user?.notifications || []);
 
  useEffect(() => {
    console.log("user is ", user?.notifications);
    setNotifications(user?.notifications || []);
  }, [user]);

  // useEffect(() => {
  //   socket.on("sendNotification", (data) => {
  //     setNotifications((prevNotifications) => [...prevNotifications, data]);
  //     console.log("Received new notification:", data);
  //   });

  //   return () => {
  //     socket.off("sendNotification");
  //   };
  // }, []);

  return (
    <div>
      {notifications.length > 0 &&
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
