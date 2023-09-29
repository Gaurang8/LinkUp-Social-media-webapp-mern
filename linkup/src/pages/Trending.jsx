import React, { useContext } from 'react'

import { MyContext } from '../MyContext';
import './CSS/home.css';
import SuggestedUser from '../components/SuggestedUser';
import Post from '../components/Post';
import Loading from '../components/Loading';


const Trending = () => {

  const { setIsAuth, setUser } = useContext(MyContext);

  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/popularposts`,
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
          console.log(data);
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
          
          {posts && posts.map((post) => {
            return <Post key={post._id} Data={post} />;
          })}
        </>
      )}
      </div>
      <div className='homepage-aside'><SuggestedUser/></div>
    </div>
  )
}

export default Trending
