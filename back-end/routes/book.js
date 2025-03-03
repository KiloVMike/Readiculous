const router = require("express").Router();
const jwt = require("jsonwebtoken")
const { authenticationToken } = require("../controller/userAuth");
const { GetbookbyId, Getbooks, Deletebook, Updatebook, Addbook, Getrecentbooks, updateCartQuantity } = require("../controller/Book");

//routes
router.post("/addbook", authenticationToken, Addbook);
router.put("/updatebook/:id", authenticationToken, Updatebook);
router.delete("/deletebook/:id", authenticationToken, Deletebook);
router.get("/getallbooks", Getbooks);
router.get("/getbook/:id", GetbookbyId);
router.get("/getrecentbooks",Getrecentbooks)


module.exports = router;