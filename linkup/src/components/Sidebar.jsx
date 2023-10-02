import React, { useState, useEffect, useContext } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Person2Icon from '@mui/icons-material/Person2';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

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
        <div className="profile-s-icon">
          <img src={user?.profileImage || 'https://picsum.photos/50/50'} alt="" style={{width:'100%',borderRadius:'50%',aspectRatio:'1'}} />
        </div>
        <div className="profile-s-name">
          <span className="profile-s-name-text">{user?.name || "name"}</span>

          <span className="profile-s-username-text">{user?.username || "@username"}</span>
        </div>
        <div>
        </div>
      </div>
      <div className="sidebar-main">
        <Link to="/" className="sidebar-item-link">
          <div className={`sidebar-item ${active === "" ? "active" : ""}`}>
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
              <Person2Icon />
            </span>
            <span className="sidebar-item-text">Profile</span>
          </div>
        </Link>
        <Link to="/trending" className="sidebar-item-link">
          <div
            className={`sidebar-item ${active === "trending" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">
              <ExploreIcon />
            </span>
            <span className="sidebar-item-text">Explore</span>
          </div>
        </Link>
        <Link to="/groups" className="sidebar-item-link">
          <div className={`sidebar-item ${active === "groups" ? "active" : ""}`}>
            <span className="sidebar-item-icon">
              <GroupIcon />
            </span>
            <span className="sidebar-item-text">Groups</span>
          </div>
        </Link>
        <Link to="/settings" className="sidebar-item-link">
          <div
            className={`sidebar-item ${active === "settings" ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">
              <SettingsIcon />
            </span>
            <span className="sidebar-item-text">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
