import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../MyContext';

const EmailForm = () => {


  const {user} = useContext(MyContext);

  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if(user){
      setNewEmail(user?.email);
      setNewUsername(user?.username);
    }
  }
  , [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      newEmail,
      newUsername,
      currentPassword,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/account/changeuseremail/${user?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('Email and username changed successfully');
        setNewEmail('');
        setNewUsername('');
        setCurrentPassword('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to change email and username');
      }
    } catch (error) {
      console.error('An error occurred while changing email and username:', error);
      setMessage('An error occurred while changing email and username');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">New Username</label>
          <input
            type="text"
            id="username"
            placeholder="New Username"
            required
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">New Email</label>
          <input
            type="email"
            id="email"
            placeholder="New Email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Current Password</label>
          <input
            type="password"
            id="password"
            placeholder="Current Password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="message">{message}</div>
        <button className="form-submit-btn" type="submit">
          Change
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
