const express = require('express');
const { authenticateToken } = require('../middlewares/authenticate');
const { GetGroups, Creategroup } = require('../controllers/groupcontrollers');
const router = express.Router();

router.get('/groups', GetGroups);
router.post('/creategroup' , authenticateToken , Creategroup)

module.exports = router;