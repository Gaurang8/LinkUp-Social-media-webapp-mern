import './App.css';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';

import User from './pages/User';
import Home from './pages/Home';
import { MyContext } from "./MyContext";


import { authUser } from "./functions/fetchapi.jsx";

import { BrowserRouter, Route, Routes, json } from "react-router-dom";
import Profile from './pages/Profile';
import News from './pages/News';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import Trending from './pages/Trending';
import CommonForm from './components/Forms/CommonForm';
import Group from './pages/Group';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [isFull, setIsFull] = useState(false);


  async function fetchUser() {
    console.log('fetch user');
    const userData = await authUser();

    
      setUser(userData);
      setIsAuth(true);
      console.log("updated user", user);

  }

  useEffect(() => {
    fetchUser();
    console.log('user useEffect')
  }, []);

  useEffect(() => {
    console.log('user', user);
  }
    , [user]);


  useEffect(() => {
    setInterval(() => {
      if (window.innerWidth < 768) {
        setIsFull(false);
      }
      else {
        setIsFull(true);
      }
    }

      , 3000);
  }, []);


  // Snackbar
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <MyContext.Provider
        value={{
          isAuth,
          setIsAuth,
          user,
          setUser,
          fetchUser
        }}
      >
        <BrowserRouter>
          {
            user ? (<>
              <Navbar />
              <Snackbar open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                  contact us at insta " _gaurang.patel_ "
                </Alert>
              </Snackbar>
              <div className='main-content-app'>
                <div className={`main-c-left ${isFull ? 'isFullclass' : ''}`}><Sidebar widthFull={`${isFull}`} /></div>
                <div className={`main-c-right ${isFull ? 'bodyshrink' : ''}`}>
                  <Routes>
                    <Route path='/profile/:userId' element={<Profile />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/groups' element={<Group />} />
                    <Route path='/settings' element={<><Settings /></>} />
                    <Route path='/trending' element={<Trending />} />
                  </Routes>
                </div>
              </div>
            </>
            ) : (<User />)
          }
        </BrowserRouter>
      </MyContext.Provider>
    </>
  );
}

export default App;
