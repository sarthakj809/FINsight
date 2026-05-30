const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.authMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success:false,
            message:"Not authorized or token missing."
        });
    }
    const token = authHeader.split(" ")[1];

    //verifying the token

    try {
        const payload = jwt.verify(token,JWT_SECRET_KEY);
        const User = await user.findById(payload.id).select("-password");
        if(!User){
            return res.status(401).json({
                success:false,
                message:"User not found."
            });
        }
        req.user = User;
        next();

    } catch (error) {
        console.error("JWT verification failed:",error);
        res.status(401).json({
            success:false,
            message:"Token invalid or expired."
        });
    }


}