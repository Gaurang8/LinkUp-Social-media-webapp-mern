import './App.css';
import { useState ,useEffect } from 'react';

import User from './pages/User';
import Home from './pages/Home';
import { MyContext } from "./MyContext";


import { authUser } from "./functions/fetchapi.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from './pages/Profile';

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

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
      else{
        setUser(null);
        setIsAuth(false);
        console.log("user is", userData);
        console.log("isAuth is", isAuth);
      }
    }
    fetchUser();
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
              isAuth ? (
                <Routes>
                <Route path='/' element={<Profile />
                }>
                </Route>
          </Routes>

              ) : (<User />)
            }
        </BrowserRouter>
      </MyContext.Provider>
    </>
  );
}

export default App;
