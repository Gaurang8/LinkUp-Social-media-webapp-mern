import React, { useContext, useState } from "react";
import img from "../../pagelogo.png";

import "../css/addtopost.css";
import { MyContext } from "../../MyContext";
import { addCoverImg } from "../../functions/fetchapi";

const CoverImgForm = ({ close }) => {
  const { user } = useContext(MyContext);

  const [images, setImages] = useState([]);
  const [tempImg, setTempImg] = useState([img]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "gaurang";

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
      .then(async (data) => {
        if (data.secure_url !== "") {
          console.log(data.secure_url + " uploaded");
          try {
            await addCoverImg(data.secure_url);
            setImages([]);
            setUploadedFileUrl("");
            setTempImg(img);
          } catch (error) {
            console.error("Error while adding image", error);
          }
        }
      })
      .catch((err) => console.error(err, "error while uploading"));
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="addpost-card">
        <div className="addpost-heading">
          <h3>Add Cover</h3>
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
            Change
          </button>
        </div>
      </div>
    </form>
  );
};
export default CoverImgForm;
