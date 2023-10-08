import React, { useContext , useEffect } from 'react'

import { MyContext } from '../MyContext';
import './CSS/home.css';
import SuggestedUser from '../components/SuggestedUser';
import Post from '../components/Post';
import Loading from '../components/Loading';


const Trending = () => {

  const { setIsAuth, setUser } = useContext(MyContext);

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
        `${process.env.REACT_APP_BACKEND_ADDR}/post/popularposts`,
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
          setPosts(data.popularPosts);
        })
        .catch((err) => console.log(err));
    };

    fetchPosts();
  }, []);

  return (
    <div className="homepage-container">
      <div className='homepage-news'>
      { !posts  ? (
        <Loading />
      ) : (
        <>
          
          {posts && posts.map((post , index) => {
            return (<><Post key={post._id} Data={post} />
            {index === 2 && smallWindow && (<div style={{margin:'auto',maxWidth:'95%'}}><SuggestedUser /></div>)}
            </>)

          })}
        </>
      )}
      </div>
      <div className='homepage-aside'><SuggestedUser/></div>
    </div>
  )
}

export default Trending
