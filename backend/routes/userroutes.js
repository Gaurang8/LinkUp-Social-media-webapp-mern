const express = require('express');
const {
    FollowUser, UnfollowUser, getUserById, SearchUsers, SuggestedUser,
} = require('../controllers/usercontrollers');
const { authenticateToken } = require('../middlewares/authenticate');
const router = express.Router();

router.post('/follow/:userId', authenticateToken, FollowUser);
router.post('/unfollow/:userId', authenticateToken, UnfollowUser);
router.get('/user/:userId', getUserById);
router.get('/searchuser/:query', SearchUsers);
router.get('/suggestedusers', authenticateToken, SuggestedUser);

module.exports = router;