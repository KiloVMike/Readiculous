const router = require("express").Router();
const { addtocart, removetocart,getusercart, updateCartQuantity } = require("../controller/Cart");
const { authenticationToken } = require("../controller/userAuth");

router.put("/addtocart", authenticationToken, addtocart)
router.put("/removetocart/:bookid", authenticationToken, removetocart)
router.get("/getusercart", authenticationToken, getusercart)


module.exports = router;
