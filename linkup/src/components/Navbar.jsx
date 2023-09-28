import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import "./css/navbar.css";

const Navbar = () => {
  // /user/:id

  const [searchUserData, setSearchUserData] = useState([]);

  const [searchUser, setSearchUser] = useState("");

  const serachfun = (e) => {
    setSearchUser(e.target.value);
  };

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDR}/searchuser/${searchUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setSearchUserData(data.users);
          });
      } catch (error) {
        console.log("Error while searching user", error);
      }
    };
    fetchSearchData();
  }, [searchUser]);

  useEffect(() => {
    if (searchUser === "") {
      setSearchUserData([]);
    }
  }, [searchUser]);

  return (
    <>
      <div className="navbar-main-parent">
        <div className="navbar-main">
          <div className="navbar-logo">
            <span>Link Up</span>
          </div>
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          <div className="navbar-user-links">
            <span className="navbar-notification">
              <NotificationsNoneIcon />
            </span>
            <span className="navbar-user-icon">
              <Avatar />
            </span>
          </div>
        </div>
        {searchUserData.length > 0 && (
          <div className="model-user-geted">
            {searchUserData.map((user) => {
              return (
                <div className="user-item-m-k">
                  <div className="n-m-user-image">
                    <img src="https://picsum.photos/30/30" alt="user" />
                  </div>
                  <div className="n-m-user-name">{user.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
