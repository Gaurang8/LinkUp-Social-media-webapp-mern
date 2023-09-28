import React from "react";
import Post from "../components/Post";
import { MyContext } from "../MyContext";

//
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import AddPostImg from "../components/AddPostImg";
import PostAddCard from "../components/PostAddCard";
import Loading from "../components/Loading";

const News = () => {
  const { user } = React.useContext(MyContext);

  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/newsfeed/0/30`,
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
          console.log(data.newsFeed);
          setPosts(data.newsFeed);
        })
        .catch((err) => console.log(err));
    };

    fetchPosts();
  }, []);

  return (
    <>
    <PostAddCard />
      { !posts  ? (
        <Loading />
      ) : (
        <>
          
          {posts && posts.map((post) => {
            return <Post key={post._id} Data={post} />;
          })}
        </>
      )}
    </>
  );
};

export default News;
