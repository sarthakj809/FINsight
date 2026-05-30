const express = require("express");
const router = express.Router();
const {registerUser,loginUser, getCurrentUser, updateProfile, updatePassword} = require('../controllers/userController');
const { authMiddleware } = require("../middleware/auth");

router.post("/register",registerUser);
router.post("/login",loginUser);

//protected routes

router.get("/me",authMiddleware,getCurrentUser);
router.put("/profile",authMiddleware,updateProfile);
router.put("/password",authMiddleware,updatePassword);

module.exports = router;