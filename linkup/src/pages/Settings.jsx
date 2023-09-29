import React ,{useState} from "react";
import CommonForm from "../components/Forms/CommonForm";
import EmailForm from "../components/Forms/EmailForm";
import PasswordForm from "../components/Forms/PasswordForm";
import ProfileImgForm from "../components/Forms/ProfileImgForm";
import "./CSS/settings.css";
import SuggestedUser from "../components/SuggestedUser";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Route, Routes } from "react-router-dom";

const Settings = () => {
  const [value, setValue] = React.useState(0);

  const [activeForm, setActiveForm] = useState('common');

  const [comArray, setComArray] = useState([<CommonForm />,]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {/* <div className='settings-main-page'> */}
      <div className="homepage-container">
        <div id="setting-main" className="homepage-news">
          <h1 className="settings-title">Settings</h1>

          <Box sx={{ bgcolor: "background.paper" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Accounts"  onClick={()=>{
                setActiveForm('common')
              }}/>
              <Tab label="Email" onClick={()=>{
                setActiveForm('email')
              }}/>
              <Tab label="Password" onClick={()=>{
                setActiveForm('password')
              }}/>
              
            </Tabs>
          </Box>

          <div className="settings-form" style={{padding:'15px'}}>
            {activeForm === 'common' && <CommonForm />}
            {activeForm === 'email' && <EmailForm />}
            {activeForm === 'password' && <PasswordForm />}
          </div>
        </div>
        <div className="homepage-aside">
          <SuggestedUser />
        </div>
      </div>

      {/* </div> */}
    </>
  );
};

export default Settings;
