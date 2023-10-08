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
import {
  authUser,
  handleCommentPost,
  handleDislikePost,
  handleLikePost,
} from "../functions/fetchapi";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Link } from "react-router-dom";

const moment = require("moment");

const Post = ({ Data }) => {
  const { user, setUser } = useContext(MyContext);

  const [postComment, setPostComment] = useState("");
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [viewMoreComment, setViewMoreComment] = useState(false);

  const [postCommentedUserDetails, setPostCommentedUserDetails] =
    useState(null);
  const [postLikedUserDetails, setPostLikedUserDetails] = useState(null);

  const handlePostCommentSubmit = async (postId) => {
    if (postComment.trim(" ").length > 0) {
      const data = await handleCommentPost(postId, postComment);
      setPostComment("");
    }
  };

  useEffect(() => {
    postLikedUserDetails?.some((like) => like._id === user?._id)
      ? setIsPostLiked(true)
      : setIsPostLiked(false);
  }, [Data, user, postLikedUserDetails, postCommentedUserDetails]);


  const fetchPostLikeUser = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/post/postlikes/${postId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPostLikedUserDetails(data.likedUsers);
      } else {
        console.log("postliked user fetch failed");
      }
    } catch (error) {
      console.log("error while fetching postliked user", error);
    }
  };

  const fetchPostCommentUser = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/post/postcomments/${postId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPostCommentedUserDetails(data.comments);
      } else {
        console.log("postcommented user fetch failed");
      }
    } catch (error) {
      console.log("error while fetching postcommented user", error);
    }
  };

  useEffect(() => {
    fetchPostCommentUser(Data?._id);
    fetchPostLikeUser(Data?._id);
  }, [Data, isPostLiked, user]);

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
              return <img src={img} alt="post-img" />;
            })}
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-like-comment">
          <div className="footer-like">
            {isPostLiked ? (
              <span
                className="icon"
                onClick={async () => {
                  await handleDislikePost(Data?._id);
                  setIsPostLiked(false);
                  await fetchPostLikeUser(Data?._id);
                }}
              >
                <FavoriteRoundedIcon style={{ color: "red" }} />
              </span>
            ) : (
              <span
                className="icon"
                onClick={async () => {
                  await handleLikePost(Data?._id);
                  setIsPostLiked(true);
                  await fetchPostLikeUser(Data?._id);
                }}
              >
                <FavoriteBorderOutlinedIcon />
              </span>
            )}
            <span className="count">{postLikedUserDetails?.length} likes</span>
          </div>
          <div
            className="footer-comment"
            onClick={() => setShowComment(!showComment)}
          >
            <span className="icon">
              <TollRoundedIcon />
            </span>
            <span className="count">
              {postCommentedUserDetails?.length} comments
            </span>
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
          <input
            type="text"
            value={postComment}
            placeholder="Write a comment..."
            onChange={(e) => setPostComment(e.target.value)}
          />
          <button
            onClick={async () => {
              await handlePostCommentSubmit(Data?._id);
              await fetchPostCommentUser(Data?._id);
            }}
          >
            <SendOutlinedIcon />
          </button>
        </div>
      </div>
      {showComment && (
        <div className="post-user-comments-list">
          {!viewMoreComment
            ? postCommentedUserDetails?.slice(0, 2).map((comment) => {
                return (
                  <>
                    <div className="post-user-comments-list-item">
                      <span>
                        <img src="https://picsum.photos/30/30" alt="" />
                      </span>
                      <div className="post-user-comments-list-item-text">
                        <span>{comment?.userData?.name} </span>
                         {comment?.commentData?.comment}
                      </div>
                    </div>
                  </>
                );
              })
            : postCommentedUserDetails?.map((comment) => {
                return (
                  <>
                    <div className="post-user-comments-list-item">
                      <span>
                        <img src="https://picsum.photos/30/30" alt="" />
                      </span>
                      <div className="post-user-comments-list-item-text">
                        <span>{comment?.userData?.name} </span>
                         {comment?.commentData?.comment}
                      </div>
                    </div>
                  </>
                );
              })}
          {postCommentedUserDetails?.length > 2 &&
            (viewMoreComment ? (
              <span
                className="view-more-btn-comment"
                onClick={() => setViewMoreComment(false)}
              >
                view less
              </span>
            ) : (
              <span
                className="view-more-btn-comment"
                onClick={() => setViewMoreComment(true)}
              >
                view more
              </span>
            ))}
        </div>
      )}
    </div>
  );
};
export default Post;
