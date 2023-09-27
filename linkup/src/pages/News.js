import React from 'react'
import Post from '../components/Post'
import { MyContext } from '../MyContext'

const News = () => {
    
    const { user } = React.useContext(MyContext);

    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {

        const fetchPosts = async () => {

            const res = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/newsfeed/0/30`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then((res) => res.json())
            .then((data) => {
                console.log(data)
                console.log(data.newsFeed);
                setPosts(data.newsFeed);
            }
            ).catch(err => console.log(err));

        }
    
        fetchPosts();
    }
    , []);
    
    return (
        <>
            {
            user && posts.map((post) => {
                return <Post key={post._id} Data={post} />
            })}
        </>
    )
}

export default News
