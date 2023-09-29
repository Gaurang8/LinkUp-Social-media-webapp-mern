import React, { useState, useEffect, useContext } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { Link, useLocation } from "react-router-dom";
import "./css/sidebar.css";
import { MyContext } from "../MyContext";

const Sidebar = ({ widthFull }) => {
  const { user } = useContext(MyContext);

  const location = useLocation();

  const [active, setActive] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    setActive(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <div className="sidebar-container">
      <div className="profile-sidebar">
        <div className="profile-s-icon"></div>
        <div className="profile-s-name">
          <span className="profile-s-name-text">Name</span>

          <span className="profile-s-username-text">@user name</span>
        </div>
        <div>
        </div>
      </div>
      <div className="sidebar-main">
        <Link to="/home" className="sidebar-item-link">
          <div className={`sidebar-item ${active === "home" ? "active" : ""}`}>
            <span className="sidebar-item-icon">
              <HomeRoundedIcon />
            </span>
            <span className="sidebar-item-text">Home</span>
          </div>
        </Link>
        <Link to={`/profile/${user?._id}`} className="sidebar-item-link">
          <div
            className={`sidebar-item ${active === "profile" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">
              <HomeRoundedIcon />
            </span>
            <span className="sidebar-item-text">Profile</span>
          </div>
        </Link>
        <Link to="/settings" className="sidebar-item-link">
          <div
            className={`sidebar-item ${active === "settings" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">
              <HomeRoundedIcon />
            </span>
            <span className="sidebar-item-text">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
