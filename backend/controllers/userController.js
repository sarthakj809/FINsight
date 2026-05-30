const user = require('../models/userModel');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES;

const createToken = (userId) => {
    return jwt.sign({id:userId},JWT_SECRET_KEY,{expiresIn : TOKEN_EXPIRES});
}

exports.registerUser = async (req,res) => {
    const {name,email,password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required. Please fill all fields."
        });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success : false,
            message : "Please enter a valid email."
        })
    }
    if(password.length < 8 || password.includes('@')){
        return res.status(400).json({
            success : false,
            message : "Password length must be 8 characters and it should not contain @ symbol. "
        })
    }

    try {
        if(await user.findOne({email})){
            return res.status(409).json({
                success : false,
                message : "User already present."
            });
        }

        const hashed = await bcrypt.hash(password,10);
        const newUser = await user.create({name,email,password:hashed});
        const token = createToken(newUser._id);
        return res.status(201).json({
            success : true,
            token,
            user : {id:newUser._id, name:newUser.name, email:newUser.email}
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }

}

// to login a user
exports.loginUser = async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Both fields are required."
        });
    }

    try {
        const User = await user.findOne({email});
        if(!User){
            return res.status(401).json({
                success:false,
                message:"Invalid Email."
            });
        }
        const match = await bcrypt.compare(password,User.password);
        if(!match){
            return res.status(401).json({
            success:false,
            message:"Invalid Password."
            });
        }

        const token = createToken(User._id);
        return res.status(200).json({
            success:true,
            token,
            user:{
                id:User._id,
                name:User.name,
                email:User.email,
            }
        })

        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}


exports.getCurrentUser = async(req,res) => {
    try {
        const User = await user.findById(req.user.id).select("name email");
        if(!User){
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        } 

        return res.json({
            success:true,
            User,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}

// to update a user profile
exports.updateProfile = async(req,res) =>{
    const {name,email} = req.body;
    if(!name || !email || !validator.isEmail(email)){
       return res.status(401).json({
            success:false,
            message:"Valid email and name are required."
       });
    }

    try {
        const exists = await user.findOne({email,_id:{$ne: req.user._id}});
        if(exists){
            return res.status(409).json({
                success:false,
                message:"Email already in use."
            });
        }

        const updatedUser = await user.findByIdAndUpdate(
            req.user.id,
            {name,email},
            {new:true,runValidators:true,select:"name email"}
        );

        res.json({
            success:true,
            updatedUser
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}


//to change user password
exports.updatePassword = async(req,res) => {
    const {password,newpassword} = req.body;
    if(!password || !newpassword || newpassword.length < 8 || newpassword.includes("@")){
        return res.status(400).json({
            success:false,
            message:"Password invalid or too short or may contain @."
        });
    }
    try {
        const User = await user.findById(req.user.id).select('password');
        if(!User){
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        }

        const match = await bcrypt.compare(password,User.password);
        if(!match){
            return res.status(401).json({
                success:false,
                message:"You have entered the wrong password."
            });
        }
        User.password = await bcrypt.hash(newpassword,10);
        await User.save();
        res.json({
            success:true,
            message:"Password changed successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}