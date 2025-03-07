const express = require("express");
const router = express.Router();
const { Signup } = require("../controller/Signup");
const { Signin } = require("../controller/Signin");
const { authenticationToken } = require("../controller/userAuth");
const { userInfo, updateUserInfo, getAllUsers, deleteUser } = require("../controller/userInfo.js");
router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/getuserinfo", authenticationToken, userInfo);//check authentication and authorization for protected route
router.put('/userinfo', authenticationToken, updateUserInfo);
router.get("/allusers", authenticationToken, getAllUsers);
router.delete("/deleteuser/:id", authenticationToken, deleteUser);


module.exports = router;