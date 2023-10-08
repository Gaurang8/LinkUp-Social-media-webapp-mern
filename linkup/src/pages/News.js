import React, { useEffect } from "react";
import Post from "../components/Post";
import { MyContext } from "../MyContext";

//
import PostAddCard from "../components/PostAddCard";
import Loading from "../components/Loading";
import SuggestedUser from "../components/SuggestedUser";

const News = () => {
  const { user } = React.useContext(MyContext);

  const [posts, setPosts] = React.useState([]);

  const [smallWindow, setSmallWindow] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) {
        setSmallWindow(true);
      } else {
        setSmallWindow(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/post/newsfeed/0/30`,
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
          setPosts(data.newsFeed);
        })
        .catch((err) => console.log(err));
    };

    fetchPosts();
  }, [user]);

  return (
    <>
    <PostAddCard />
      { !posts  ? (
        <Loading />
      ) : (
        <>
          
          {posts && posts.map((post , index) => {
            return (<><Post key={post._id} Data={post} />
            {index === 3 && smallWindow && (<div style={{margin:'auto',maxWidth:'95%'}}><SuggestedUser /></div>)}
            </>)
          })}
        </>
      )}
    </>
  );
};

export default News;
