const express = require("express");
const { authenticateToken } = require("../middlewares/authenticate");
const {
  UpdateAccountDetails,
  UpdateAccountType,
  ChangeAccountEmail,
  ChangeAccountPassword,
  AddAccountCoverImg,
  AddAccountProfileImg,
} = require("../controllers/accountcontrollers");

const router = express.Router();

router.patch('/update', authenticateToken, UpdateAccountDetails);
router.patch('/updateaccounttype/:userId', authenticateToken, UpdateAccountType);
router.patch('/changeuseremail/:userId', authenticateToken, ChangeAccountEmail);
router.patch('/changeuserpassword/:userId', authenticateToken, ChangeAccountPassword);
router.post('/addcoverimg', authenticateToken, AddAccountCoverImg);
router.post('/addprofileimg', authenticateToken, AddAccountProfileImg);

module.exports = router;
