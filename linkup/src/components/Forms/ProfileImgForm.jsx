import React, { useContext ,useState } from "react";
import img from "../../pagelogo.png";

import "../css/addtopost.css";
import { MyContext } from "../../MyContext";
import { addProfileImg } from "../../functions/fetchapi";

const ProfileImgForm = ({close}) => {
  
  const { user } = useContext(MyContext);

  const [images, setImages] = useState([]);
  const [tempImg, setTempImg] = useState([img]);

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

    setTempImg(URL.createObjectURL(e.target.files[0]));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const imageData = images.map((base64String) => {
      const base64Data = base64String.split(",")[1];
      return base64Data;
    });
  
    try {
      await addProfileImg(imageData);
      setImages([]);
      setTempImg(img);
    } catch (error) {
      console.error("Error while adding image", error);
    }
  };
  


  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
    <div className="addpost-card">
      <div className="addpost-heading">
        <h3>Add Profile Image</h3>
        <button className="addpost-close-btn" onClick={close}>
          X
        </button>
      </div>
      <div className="addpost-img-content">
        <label className="imageoriconclass" htmlFor="images">
          <input
            type="file"
            name="images"
            id="images"
            accept="image/*"
            multiple
            onChange={(e)=>{handleImageChange(e)}}
          />
          <img src={tempImg} />
        </label>
      </div>
      <div className="addpost-btn-content">
        <button className="addpost-btn">cancel</button>
        <button className="addpost-btn" type="submit">
          Change
        </button>
      </div>
    </div>
    </form>
  )
}

export default ProfileImgForm
