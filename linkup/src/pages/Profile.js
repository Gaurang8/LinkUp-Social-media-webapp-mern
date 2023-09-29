import React, { useState, useEffect, useContext } from "react";
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
import {  authUser, handleAddPost, handleCommentPost, handleDeleteComment, handleDeletePost, handleDislikePost, handleFollow, handleLikePost, handleLogout, handleUnfollow } from "../functions/fetchapi";
import Notifications from "../components/Notifications";
import { MyContext } from "../MyContext";
import { useParams } from "react-router-dom";
import moment from "moment";

const Profile = () => {

  const { isAuth, user , setUser} = useContext(MyContext);

  const { userId } = useParams();

  const [selfUser, setSelfUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {

    if (isAuth && userId === user._id || !userId) {
      setSelfUser(true);
      setUserData(user);
      console.log("user is", userData);
    }
    else {
      setSelfUser(false);
      setUserData(null);
    }
  }
    , [isAuth, userId, user]);

  useEffect(() => {
    if (!selfUser){
      console.log("user id is", userId);
      findUserById(userId);
    }
  }, [userId , user , selfUser]);

  const findUserById = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/user/${userId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.user);
          setUserData(data.user);
        });
    } catch (error) {
      console.log("Error while finding user", error);
    }
  };

  useEffect(() => {

    if (userData && user) {
      if (user?.following?.includes(userData._id)) {
        setIsFollowing(true);
      }
      else {
        setIsFollowing(false);
      }
    }
  }, [userData, user]);

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
            <div className="p-c-name">{userData?.name}</div>
            <div className="p-c-followers">
              <span>{userData?.followers?.length} followers</span>
              <span>{userData?.following?.length} Followings</span>
            </div>
            <div className="p-c-message-more">
              {
                isFollowing ? <span className="p-c-msg" onClick={ async ()=>{
                  await handleUnfollow(userData._id);
                  const newUserData = await authUser();
                  setUser(newUserData);

                }}> unfollow </span> : <span className="p-c-msg" onClick={async()=>{
                  await handleFollow(userData._id);
                  const newUserData = await authUser();
                  setUser(newUserData);
                }}> follow </span>
              }
              <span className="p-c-share" onClick={() => { handleDeletePost("650df54a81248aaf72e9c362") }}>
                <IosShareIcon />
              </span>
              <span className="p-c-more" onClick={() => { handleLogout() }}>
                <MoreVertIcon />
              </span>
            </div>
            <div className="p-c-links" >
              <TwitterIcon onClick={() => { handleAddPost("lorem dfd fhed fdfeuf efefe", "https://picsum.photos/50/50") }} />
              <FacebookIcon onClick={() => { handleLikePost("650df54a81248aaf72e9c362") }} />
              <InstagramIcon onClick={() => { handleCommentPost("650df54a81248aaf72e9c362", "Gaurang is a good boy") }} />
            </div>
            <div className="p-c-created-date-and-report">
              <span onClick={() => { handleDislikePost("650df54a81248aaf72e9c362") }}>{`Joined Since ${moment(userData?.createdAt).format("MMM YYYY")} `}</span>
              <span onClick={() => { handleDeleteComment("650df54a81248aaf72e9c362", "650dce93a956ff9fcc32b14c") }}>Report This User</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="p-p-disc-section">
            <div className="p-p-fullname">
              <span className="name">
                Hi,i'm {userData?.name}
              </span>
              <span className="p-edit-btn">
                Edit Your Profile
              </span>
            </div>
            <div className="p-p-disc"> {userData?.description} </div>
            <div className="p-p-more-details">
              <table>
                <tr>
                  <td><HomeOutlinedIcon /> Lives In</td>
                  <td>{userData?.location}</td>
                </tr>
                <tr>
                  <td><PersonOutlineOutlinedIcon /> Account</td>
                  <td>{userData?.accountType}</td>
                </tr>
                <tr>
                  <td><InterpreterModeOutlinedIcon /> Speak</td>
                  <td>{userData?.languageSpeak.join(',')}</td>
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



          {
            userData && userData?.posts.map((post) => {
              return <Post key={post._id} Data={post} />

            })}
        </div>
      </div>
    </div>
  );
};

export default Profile;


