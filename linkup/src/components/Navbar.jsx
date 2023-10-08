import { Avatar, OutlinedInput } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import "./css/navbar.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Notifications from "./Notifications";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { authUser, handleLogout } from "../functions/fetchapi";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { MyContext } from "../MyContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useContext(MyContext);

  const [searchUserData, setSearchUserData] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [userModal, setUserModal] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDR}/user/searchuser/${searchUser}`,
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
           <Link to='/'><span>Link Up</span></Link>
          </div>
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          <div className="navbar-user-links">
            <span className="navbar-notification" onClick={() => handleOpen()}>
              <NotificationsNoneIcon />
            </span>
            <span className="navbar-user-icon" onClick={()=> setUserModal(!userModal)}>
              <Avatar />
            </span>
          </div>
        </div>
        {userModal && (
          <div className="user-icon-modal">
            <div className="profile-sidebar">
              <div className="profile-s-icon"></div>
              <div className="profile-s-name">
                <span className="profile-s-name-text">Name</span>

                <span className="profile-s-username-text">@user name</span>
              </div>
              <div></div>
            </div>
            <div className="user-icon-main">
              <div className="user-icon-m-item">
                <span className="user-icon-m-item-icon">
                  <SettingsOutlinedIcon />
                </span>
                <span className="user-icon-m-item-text">My Account</span>
              </div>

              <div
                className="user-icon-m-item"
                onClick={async () => {
                  await handleLogout();
                  const newUser = await authUser();
                  setUser(newUser);
                }}
              >
                <span className="user-icon-m-item-icon">
                  <LogoutIcon />
                </span>
                <span className="user-icon-m-item-text">Log out</span>
              </div>
            </div>
          </div>
        )}
        {searchUserData.length > 0 && (
          <div className="model-user-geted">
            {searchUserData.map((user) => {
              return (
                <Link to={`/profile/${user._id}`} className="user-item-m-k">
                  <div className="n-m-user-image">
                    <img src="https://picsum.photos/30/30" alt="user" />
                  </div>
                  <div className="n-m-user-name">{user.name}</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="notification-modal-class">
          <Notifications close={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
