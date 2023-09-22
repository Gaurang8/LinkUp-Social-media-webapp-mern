import React from "react";
import "./CSS/profile.css";
import defImg from "../default_cover.jpg";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import InterpreterModeOutlinedIcon from '@mui/icons-material/InterpreterModeOutlined';
import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Post from "../components/Post";

const Profile = () => {
  return (
    <div className="main-profile-container">
      <div className="profile-theme-page">
        <div className="profile-cover">
          <img src={defImg} alt="coverimage" />
          <span>Edit Cover</span>
        </div>
      </div>
      <div className="profile-page-content">
        <div className="left">
          <div className="profile-left-card">
            <div className="p-c-avtar">
              <img></img>
            </div>
            <div className="p-c-name">Gaurang Khambhaliya</div>
            <div className="p-c-followers">
              <span>999 followers</span>
              <span>999 Followings</span>
            </div>
            <div className="p-c-message-more">
              <span className="p-c-msg">Message</span>
              <span className="p-c-share">
                <IosShareIcon />
              </span>
              <span className="p-c-more">
                <MoreVertIcon />
              </span>
            </div>
            <div className="p-c-links">
              <TwitterIcon />
              <FacebookIcon />
              <InstagramIcon />
            </div>
            <div className="p-c-created-date-and-report">
              <span>Joined Since Nov 2017 </span>
              <span>Report This User</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="p-p-disc-section">
            <div className="p-p-fullname">
              <span className="name">
                Hi,i'm Gaurang Khambhaliya
              </span>
              <span className="p-edit-btn">
                Edit Your Profile
              </span>
            </div>
            <div className="p-p-disc"> this is disc de erc dfefc dfefc efecdj fdhf dfdsufdhf fdfuh f fhifhaid ffd dfsdf dfdf fggjdighe fadhu aigt fdugfaifggtihd ugfad dfdfd fd fdf fejf ef </div>
            <div className="p-p-more-details">
              <table>
                <tr>
                  <td><HomeOutlinedIcon /> Lives In</td>
                  <td>Ahmedabad , Gujrat</td>
                </tr>
                <tr>
                  <td><PersonOutlineOutlinedIcon /> Account</td>
                  <td>Verified Member</td>
                </tr>
                <tr>
                  <td><InterpreterModeOutlinedIcon /> Speak</td>
                  <td>Gujrati , Hindi</td>
                </tr>
              </table>
            </div>
          </div>

          <div className="add-post-from-profile-page">
            <div className="post-content">
              <div className="add-post-user-avtar">
                <Avatar
                  sx={{ bgcolor: deepOrange[500] }}
                  alt="Gaurang"
                  src="/broken-image.jpg"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="add-post-text">
                <input type="text" placeholder="What's on your mind?" />
              </div>
            </div>
            <div className="post-add-content-btn">
              <span><CameraAltOutlined /></span>
              <span><VideoCallOutlinedIcon /></span>
              <span><GifBoxOutlinedIcon /></span>
            </div>
          </div>



          {Array(5)
            .fill()
            .map((_, i) => (
             <Post/>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
