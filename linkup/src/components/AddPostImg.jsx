import React, { useContext, useState } from "react";
import img from "../pagelogo.png";

import "./css/addtopost.css";
import { MyContext } from "../MyContext";

import { handleAddPost } from "../functions/fetchapi";

const AddPostImg = ({ Closebtn }) => {
  const { user , fetchUser } = useContext(MyContext);

  const [text, setText] = useState("");
  const [images, setImages] = useState(null);
  const [tempImg, setTempImg] = useState([img]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "gaurang";

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    setImages(selectedImage);

    setTempImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", images);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then( async (data) => {
        if (data.secure_url !== "") {
          console.log(uploadedFileUrl + " uploaded");
          try {
            if (!text && !images) {
              return;
            }

              await handleAddPost(text, data.secure_url);
              setText("");
              setImages(null);
              setTempImg(img);
              console.log("post added successfully");
              fetchUser();
            }
           catch (error) {
            console.error("Error while adding post", error);
          }
        }
      })
      .catch((err) => console.error(err, "error while uploading"));


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
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
            <img src={tempImg} />
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
