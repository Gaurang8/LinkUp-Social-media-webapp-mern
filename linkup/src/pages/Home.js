import React,{useContext} from 'react'

import { authUser, handleLogout } from '../functions/fetchapi'
import { MyContext } from '../MyContext';


const Home = () => {

  const {setIsAuth , setUser} = useContext(MyContext);

  return (
    <div>
      home
        <button onClick={() => {
        handleLogout()
        setIsAuth(false)
        setUser(null)
        }}>Logout</button>
    </div>
  )
}

export default Home
