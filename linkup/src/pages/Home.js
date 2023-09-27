import React, { useContext } from 'react'

import { authUser, handleLogout } from '../functions/fetchapi'
import { MyContext } from '../MyContext';
import Sidebar from '../components/Sidebar';
import './CSS/home.css';
import News from './News';


const Home = () => {

  const { setIsAuth, setUser } = useContext(MyContext);

  return (
    <div className="homepage-container">
      <div className='homepage-news'><News/></div>
      <div className='homepage-aside'><Sidebar/></div>
    </div>
  )
}

export default Home
