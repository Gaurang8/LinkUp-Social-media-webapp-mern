import React from "react";
import "./css/post.css";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import TollRoundedIcon from "@mui/icons-material/TollRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { MyContext } from "../MyContext";
const moment = require('moment');

const Post = ({Data}) => {

  const {  user } = React.useContext(MyContext);


  console.log(Data)

  return (
    <div className="post-card-container">
      <div className="post-header">
        <div className="post-header-left">
          <div className="post-header-left-avatar">
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              alt="Gaurang"
              src="https://picsum.photos/25/25"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="post-header-left-name-time">
            <div className="post-header-left-username">{Data?.name || user?.name}</div>
            <div className="post-header-left-date">{moment(Data.createdTime).format("MMM D [at] h:mma") || Data&& Data?.createdTime }</div>
          </div>
        </div>
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
              return <img src={`data:image/*;base64,${img}`} alt="post-img" />
            })}
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-like-comment">
          <div className="footer-like">
            <span className="icon">
              <FavoriteRoundedIcon style={{ color: "red" }} />
            </span>
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
    </div>
  );
};
export default Post;
