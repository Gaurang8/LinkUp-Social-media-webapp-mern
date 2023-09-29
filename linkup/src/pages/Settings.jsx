import React from 'react'
import CommonForm from '../components/Forms/CommonForm'
import EmailForm from '../components/Forms/EmailForm'
import PasswordForm from '../components/Forms/PasswordForm'
import ProfileImgForm from '../components/Forms/ProfileImgForm'
import './CSS/settings.css'

const Settings = () => {
  return (<>
    <div className='settings-main-page'>
    <CommonForm/>
    <EmailForm/>
    <PasswordForm/>
    <ProfileImgForm/>
    </div>
    </>
  )
}

export default Settings
