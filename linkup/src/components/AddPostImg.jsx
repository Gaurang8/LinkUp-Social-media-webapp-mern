import React, { useContext } from "react";
import img from "../pagelogo.png";

import "./css/addtopost.css";
import { MyContext } from "../MyContext";

const AddPostImg = ({Closebtn}) => {
  const { user } = useContext(MyContext);

  return (
    <div className="addpost-card">
      <div className="addpost-heading">
        <h3>Add Post</h3>
        <button className="addpost-close-btn" onClick={Closebtn}>X</button>
      </div>
      <div className="addpost-text-content">
        <div className="addpost-user-icon">
          <img src="https://picsum.photos/30/30" alt="user" />
        </div>
        <textarea
          className="addpost-textarea"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
      <div className="addpost-img-content">
        <label className="imageoriconclass" htmlFor="postimg">
          <input type="file" name="postimg" id="postimg" accept=".jpeg, .jpg"/>
          <img src={img} />
        </label>
      </div>
      <div className="addpost-btn-content">
        <button className="addpost-btn">cancel</button>
        <button className="addpost-btn">Post</button>
      </div>
    </div>
  );
};
export default AddPostImg;
