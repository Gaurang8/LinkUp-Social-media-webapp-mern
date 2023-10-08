import React, { useState } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../MyContext';

const PasswordForm = () => {
  const { user } = useContext(MyContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords don't match");
      return;
    }

    const data = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/account/changeuserpassword/${user?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

      if (response.ok) {
        setMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('An error occurred while changing the password:', error);
      setMessage('An error occurred while changing the password');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentpass">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            id="currentpass"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newpass1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            id="newpass1"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newpass2">Confirm New Password</label>
          <input
            type="password"
            id="newpass2"
            placeholder="Confirm New Password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
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

export default PasswordForm;
