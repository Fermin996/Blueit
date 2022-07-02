const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    text: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, required:true, ref:"User"},
    userName: {type: String, required:true},
    comments: [{type: mongoose.Types.ObjectId, required:true, ref:"Comment"}],
    votes: Number,
    post:{type: mongoose.Types.ObjectId, ref:"Post"},
    parentComment:{type: mongoose.Types.ObjectId, ref:"Comment"},
    date: {type: Date, required:true}
})

module.exports = mongoose.model('Comment', commentSchema);