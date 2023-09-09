import React from 'react'

import { authUser, handleLogout } from '../functions/fetchapi'


const Home = () => {
  return (
    <div>
      home
        <button onClick={() => {
        handleLogout()
        }}>Logout</button>
    </div>
  )
}

export default Home
