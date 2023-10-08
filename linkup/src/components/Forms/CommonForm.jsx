import React, { useState , useEffect ,useContext } from "react";
import "../../pages/CSS/user.css";
import { MyContext } from "../../MyContext";

const CommonForm = ({close}) => {
  const { user } = useContext(MyContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [dob, setDob] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState("");

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setDescription(user?.description);
      setLocation(user?.location);
      setLanguage(user?.languageSpeak);
      setDob(user?.dob);
      setSocialMediaLinks(user?.socialMediaLinks);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      location,
      dob,
      languageSpeak: language,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDR}/account/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User profile updated successfully:", data);
        
      } else {
        console.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("An error occurred while updating user profile:", error);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input
            type="text"
            id="language"
            placeholder="Language"
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            placeholder="Date of Birth"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="socialMediaLinks">Social Media Links</label>
          <input
            type="text"
            id="socialMediaLinks"
            placeholder="Social Media Links"
            value={socialMediaLinks}
            onChange={(e) => setSocialMediaLinks(e.target.value)}
          />
        </div> */}
        <button className="form-submit-btn" type="submit">
          Change
        </button>
      </form>
    </div>
  );
};

export default CommonForm;
