const express = require('express');
const { authenticateToken } = require('../middlewares/authenticate');
const { AddNewPost, DeletePost, LikePost, DisLikePost, CommentPost, DeleteCommentPost, GetPostLikes, GetPostComments, GetPopularPost, GetNewsfeedPost } = require('../controllers/postcontrollers');
const { route } = require('../app');
const router = express.Router();

router.post('/addnewpost', authenticateToken, AddNewPost);
router.delete('/deletepost/:postId' , authenticateToken , DeletePost);
router.patch('/likepost/:postId' , authenticateToken , LikePost);
router.patch('/dislikepost/:postId' , authenticateToken , DisLikePost);
router.patch('/commentpost/:postId' , authenticateToken , CommentPost);
router.delete('/deletecomment/:postId/:commentId', authenticateToken, DeleteCommentPost);
router.get('/postlikes/:postId',GetPostLikes);
router.get('/postcomments/:postId',GetPostComments);
router.get('/popularposts',GetPopularPost);
router.get('/newsfeed/:offset/:limit', authenticateToken, GetNewsfeedPost);

module.exports = router;