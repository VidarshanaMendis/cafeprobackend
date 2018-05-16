const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Comment = require('../models/comments');

router.post('/savecomments',(req,res,next) => {
    console.log("savecomment called");
    const newComment = new Comment({
        restaurantId:req.body.restaurantId,
        userId:req.body.userId,
        comment:req.body.comment,
        rating:req.body.rating,
    });
    Restaurant.addComment(newComment,(err,comment)=> {
        if(err) {
            res.json({success: false, msg:'failed to save comment'})
            console.log("failed to save comment");
        }if(comment){
            res.json({success:true, msg: "saved successfully"})
            console.log("comment saved successfully");
        }
    });
});