const mongoose = require('mongoose');
const config = require('../config/database');

const CommentSchema = mongoose.Schema({
    restaurantId:{
        type:String,
        required:true
    },
    userId: {
        type:String,
        required:true
    },
    comment: {
        type: String,
        required: true
    },

    rating:{
        type:Float32Array
    }

});
const Comment = module.exports=mongoose.model('comment',CommentSchema);

module.exports.addComment = function (newComment,callback){
    newComment.save(callback);
}