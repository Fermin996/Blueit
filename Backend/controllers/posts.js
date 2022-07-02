
const { json } = require('body-parser');
const mongoose = require('mongoose');
const Post = require('../models/post');
const user = require('../models/user');
const User = require('../models/user')


const getPosts = async(req,res,next) => {
    let page
    
    try{
        console.log(req.params)
        if(req.params.op === "date"){
            page = await Post.find({}).limit(15).sort({$natural:-1})

        }else if(req.params.op==="votes"){
            page = await Post.find({}).limit(15).sort({"votes":-1})
        }
    }catch(err){
        console.log(err)
    }


    
    res.json({ page: page.map( post => post.toObject({getters: true})) })

}

const getPostsBySub = async(req, res, next) => {
    const currSub = req.params.subName;
    let page;
    console.log(currSub)
    try{    
        page = await Post.find({sub:currSub})
        console.log(page)
        console.log("above is the page")  
    }catch(err){
        console.log(err)
    }


    res.json({page})
}

const getPostById = async(req, res, next) => {
    const postId = req.params.pid
    let post;

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }


    res.json({post: post.toObject({getters:true})})

}

const getPostsByUser= async(req, res, next) => {
    const userId = req.params.uid
    let currUser; 
    // console.log(page)
    try{
        currUser = await User.findById(userId).populate('posts')
    }catch(err){
        console.log(err)
    }


    res.json({currUser})
}



const createPost= async (req,res,next) => {
    const { user, title, text, sub, subName, comments, username} = req.body
    const createdPost = new Post({
        title,
        text,
        user,
        sub,
        votes:1,
        voteUsers:[{
            userVote:{
                user:user,
                voteType:"upVote"
            }
        }],
        comments,
        username,
        subName,
        date: Date()
    })

    let currUser;
    try{
        currUser = await User.findById(user)
    }catch(err){
        return "ERRRORRR"
    }

    try{
        // const sess = await mongoose.startSession()
        // sess.startTransaction()
        // await createdPost.save({ session: sess })
        // currUser.posts.push(createdPost)
        // await currUser.save()
        // await sess.commitTransaction()

        await createdPost.save()
        currUser.posts.push(createdPost)
        // currUser.votes.push(createdPost)
        await currUser.save()

    }catch(err){
        console.log("MAssiv erreor")
        return next(err)
    }
        
    console.log(createdPost)
    res.status(201).json({post: createdPost})
}

const editPost = async(req, res, next) => {
    const postId = req.params.pid

    let post;

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }


    post.text = req.body.text;

    try{
        await post.save()
    }catch(err){
        console.log(err)
    }

    res.status(201).json({ post: post.toObject({ getters: true }) })
    
}

const changeVotes = async(req, res, next)=>{
    const postId = req.params.pid
    let post

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }

    let voteType = req.body.voteType
    let voteUser = req.body.userId.userId
    let voteId = req.body.voteId
    let foundIndex

    if(voteId){
        console.log(voteId)
        foundIndex = post.voteUsers.findIndex((v) => JSON.stringify(v._id) === `"${voteId}"`)
    }
    if(voteType === "upVote"){
        post.voteUsers.push({userVote: {user:voteUser, voteType}})
        post.votes+=1;
    }else if(voteType === "downVote"){
        post.voteUsers.push({userVote: {user:voteUser, voteType}})
        post.votes-=1;
    }else if(voteType === "upUnclicked"){
        post.voteUsers.splice(foundIndex, 1)
        post.votes-=1
    }else if(voteType === "downUnclicked"){
        post.voteUsers.splice(foundIndex, 1)
        post.votes+=1
    }else if(voteType === "dtoU"){
        let tempVote = post.voteUsers[foundIndex]
        tempVote.userVote.voteType = "upVote"
        post.votes+=2
    }else if(voteType === "utoD"){
        let tempVote = post.voteUsers[foundIndex]
        tempVote.userVote.voteType = "downVote"
        post.votes-=2
    }

    try{
        await post.save()
    } catch(err){
        console.log(err)
    }

    res.status(201).json({ post: post.toObject({ getters: true }) })

}

const deletePost= async(req, res, next)=>{
    const postId = req.params.pid
    let post;
    try{
        post = await post.findById(postId)
    }catch(err){
        console.log(err)
    }

    try{
        await post.remove()
    }catch(err){
        console.log(err)
    }

    res.status(200).json({ message:"post deleted" })

}

exports.getPostsBySub = getPostsBySub;
exports.getPostsByUser = getPostsByUser;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.editPost = editPost;
exports.deletePost = deletePost;
exports.getPosts = getPosts;
exports.changeVotes = changeVotes;