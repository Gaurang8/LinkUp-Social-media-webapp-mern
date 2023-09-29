import React, { useState, useContext, useEffect } from "react";
import "./css/post.css";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import TollRoundedIcon from "@mui/icons-material/TollRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { MyContext } from "../MyContext";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { authUser, handleCommentPost, handleDislikePost, handleLikePost } from "../functions/fetchapi";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Link } from "react-router-dom";

const moment = require("moment");

const Post = ({ Data }) => {
  const { user , setUser } = useContext(MyContext);

  const [postComment, setPostComment] = useState("");
  const [isPostLiked,setIsPostLiked] = useState(false);

  const handlePostCommentSubmit = async (postId) => {
    if (postComment.trim(" ").length > 0) {
      const data = await handleCommentPost(postId, postComment);
      const newUser = authUser();
      setUser(newUser);
    }
  };

  useEffect (()=>{
    setIsPostLiked(Data?.likes?.includes(user?._id));
  } 
  ,[Data,user])

  console.log(Data);

  return (
    <div className="post-card-container">
      <div className="post-header">
        <Link to={`/profile/${Data?.userId}`} className="post-header-left">
          <div className="post-header-left-avatar">
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              alt="Gaurang"
              src="https://picsum.photos/25/25"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="post-header-left-name-time">
            <div className="post-header-left-username">
              {Data?.name || user?.name}
            </div>
            <div className="post-header-left-date">
              {moment(Data.createdTime).format("MMM D [at] h:mma") ||
                (Data && Data?.createdTime)}
            </div>
          </div>
        </Link>
        <div className="post-header-right">
          <div className="post-header-right-more-btn">
            <MoreHorizIcon />
          </div>
        </div>
      </div>
      <div className="post-body">
        <div className="post-body-text-content">{Data?.text}</div>
        <div className="post-body-image">
          {/* <img src="https://picsum.photos/200/300" alt="post-img" /> */}
          {Data.images &&
            Data.images.map((img) => {
              return <img src={`data:image/*;base64,${img}`} alt="post-img" />;
            })}
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-like-comment">
          <div className="footer-like">
            {
              isPostLiked ? <span className="icon"
              onClick={()=>{
                handleDislikePost(Data?._id);
                setIsPostLiked(false);
              }} >
              <FavoriteRoundedIcon style={{ color: "red" }} />
            </span> : <span className="icon" onClick={()=>{
              handleLikePost(Data?._id);
              setIsPostLiked(true);
            }}>
              <FavoriteBorderOutlinedIcon />
            </span>
            }
            <span className="count">{Data?.likes?.length} likes</span>
          </div>
          <div className="footer-comment">
            <span className="icon">
              <TollRoundedIcon />
            </span>
            <span className="count">{Data?.comments?.length} comments</span>
          </div>
        </div>
        <div className="footer-share">
          <span className="icon">
            <ShareOutlinedIcon />
          </span>
          <span className="count">Share</span>
        </div>
      </div>
      <div className="post-comment-footer">
        <div className="post-comment-avtar">
          <Avatar />
        </div>
        <div className="post-comment-section">
          <input type="text" value={postComment} placeholder="Write a comment..."  onChange={(e)=> setPostComment(e.target.value)}/>
          <button
            onClick={() => {
              handlePostCommentSubmit(Data?._id);
            }}
          >
            <SendOutlinedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Post;
