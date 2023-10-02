import React,{useState , useContext} from "react";
import "./css/addtopost.css";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import GifOutlinedIcon from '@mui/icons-material/GifOutlined';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddPostImg from "./AddPostImg";
import { handleAddPost } from "../functions/fetchapi";
import { MyContext } from "../MyContext";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
  };

const PostAddCard = () => {

  const {fetchUser} = useContext(MyContext);

    const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [text, setText] = useState("");

  const handleSubmit = async () => {
  
    try {
      if(text.trim(" ").length > 0){
        await handleAddPost(text);
        await fetchUser();
        setText("");
      }
    } catch (error) {
      console.error("Error while adding post", error);
    }
  };

  return (
    <>
      <div className="addpost-model">
        <div className="p-m-header">
          <ModeEditOutlineOutlinedIcon />
          <span> Create Post</span>
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
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div className="postfooter">
          <div className="left">
            <div className="postfooter-item"  onClick={handleOpen}>
              <button>
                <VideocamOutlinedIcon sx={{color:"red"}} />
              </button>
              <span>Video</span>
            </div>
            <div className="postfooter-item" onClick={handleOpen}>
              <button >
                <AddAPhotoOutlinedIcon sx={{color:"blue"}}/>
              </button>
              <span>Photo</span>
            </div>
            <div className="postfooter-item"  onClick={handleOpen}>
              <button>
                <GifOutlinedIcon sx={{color:'orange',padding:'0 !important'}}/>
              </button>
              <span>Gif/Activity</span>
            </div>
          </div>
          <div className="right" onClick={()=>{handleSubmit()}}>
            <SendOutlinedIcon />
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddPostImg Closebtn={handleClose}/>
        </Box>
      </Modal>
    </>
  );
};

export default PostAddCard;
