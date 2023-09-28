import React, { useContext ,useState } from "react";
import img from "../pagelogo.png";

import "./css/addtopost.css";
import { MyContext } from "../MyContext";

import { handleAddPost } from "../functions/fetchapi";

const AddPostImg = ({ Closebtn }) => {
  const { user } = useContext(MyContext);

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    const imageBase64Array = [];
  
    for (let i = 0; i < selectedImages.length; i++) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        imageBase64Array.push(event.target.result);
        if (imageBase64Array.length === selectedImages.length) {
          setImages(imageBase64Array);
        }
      };
  
      reader.readAsDataURL(selectedImages[i]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const imageData = images.map((base64String) => {
      const base64Data = base64String.split(",")[1];
      return base64Data;
    });
  
    try {
      await handleAddPost(text, imageData);
      setText("");
      setImages([]);
    } catch (error) {
      console.error("Error while adding post", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
    <div className="addpost-card">
      <div className="addpost-heading">
        <h3>Add Post</h3>
        <button className="addpost-close-btn" onClick={Closebtn}>
          X
        </button>
      </div>
      <div className="addpost-text-content">
        <div className="addpost-user-icon">
          <img src="https://picsum.photos/30/30" alt="user" />
        </div>
        <textarea
          className="addpost-textarea"
          placeholder="What's on your mind?"
          value={text}
          name="text"
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="addpost-img-content">
        <label className="imageoriconclass" htmlFor="images">
          <input
            type="file"
            name="images"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <img src={img} />
        </label>
      </div>
      <div className="addpost-btn-content">
        <button className="addpost-btn">cancel</button>
        <button className="addpost-btn" type="submit">
          Post
        </button>
      </div>
    </div>
    </form>
  );
};
export default AddPostImg;
