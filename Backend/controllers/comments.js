const { text } = require("body-parser")
const mongoose = require("mongoose")
const Comment = require("../models/comments")
const User = require("../models/user")
const Post = require("../models/post")

const createComment = async(req, res, next) => {

    const { text, user, post, parentComment, username } = req.body
    const createdComment = new Comment({
        text,
        user,
        userName:username,
        post,
        comments:[],
        votes:0,
        parentComment,
        date: Date()
    })

    let currUser;
    let currParent;

    try{
        if(parentComment){
            currParent = await Comment.findById(parentComment)
        }else{
            currParent = await Post.findById(post)
        }

        currUser = await User.findById(user)
        
    }catch(err){
        console.log(err)
    }

    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdComment.save({ session: sess })
        currUser.comments.push(createdComment)
        currParent.comments.push(createdComment)
        await currParent.save({session: sess})

        await currUser.save({session: sess})
        await sess.commitTransaction()
    }catch(err){
        console.log("MAssiv erreor")
        return next(err)
    }

    res.status(201).json({comment: createdComment})

}

const getCommentsByParent = async (req,res,next)=>{

    const currParent = req.params.pid
    let comments

    try{
        comments = await Comment.findById(currParent).populate('comments')
    }catch(err){
        console.log(err)
    }

    res.json(comments.comments)

}

const getCommentsByPost = async (req,res,next)=>{

    const currPost = req.params.pid
    //console.log(req.body)
    let comments

    try{
        comments = await Post.findById(currPost).populate('comments')
    }catch(err){
        console.log(err)
    }

    res.json(comments.comments)

}

const getCommentByUser = async (req,res,next)=>{
    const userId = req.params.uid

    let comments
    try{
        comments = await User.findById(userId).populate('comments')
    }catch(err){
        console.log(err)
    }
    console.log(comments)
    console.log("THIS IS THE FIRS?T COMMENT")
    res.json(comments)
}

const editComment = async(req,res,next)=>{

}

const deleteComment = async(req,res,next)=>{

}

exports.createComment = createComment;
exports.getCommentsByParent = getCommentsByParent;
exports.getCommentsByPost = getCommentsByPost;
exports.getCommentByUser = getCommentByUser;
exports.editComment = editComment;
exports.deleteComment = deleteComment;