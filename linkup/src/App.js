import './App.css';
import { useState, useEffect } from 'react';

import User from './pages/User';
import Home from './pages/Home';
import { MyContext } from "./MyContext";


import { authUser } from "./functions/fetchapi.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from './pages/Profile';
import News from './pages/News';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const userData = await authUser();
      console.log(userData);
      if (userData) {
        setUser(userData);
        setIsAuth(true);

        console.log("user is", userData);
        console.log("isAuth is", isAuth);
      }
      else {
        setUser(null);
        setIsAuth(false);
        console.log("user is", userData);
        console.log("isAuth is", isAuth);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setInterval(() => {
    if (window.innerWidth < 768) {
      setIsFull(false);
    }
    else {
      setIsFull(true);
    }
    }
    , 1000);
  },[]);


  return (
    <>
      <MyContext.Provider
        value={{
          isAuth,
          setIsAuth,
          user,
          setUser,
        }}
      >
        <BrowserRouter>
          {
            isAuth ? (<>
              <Navbar />
              <div className='main-content-app'>
                <div className={`main-c-left ${isFull ? 'isFullclass' : ''}`}><Sidebar widthFull={`${isFull}`} /></div>
                <div className={`main-c-right ${isFull ? 'bodyshrink' : ''}`}>
                  <Routes>
                    <Route path='/' element={<Profile />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/news' element={<News />} />
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
