const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const signup = async (req, res, next)=>{
    const { username, email, password } = req.body
    let userExists;

    

    try{
        userExists = await User.findOne({ email: email})
    }catch(err){
        console.log(err)
    }

    if(userExists){
        return "USER EXISTS"
    }

    let hashedPass;

    try{
        hashedPass = await bcrypt.hash(password, 12);
    }catch(err){
        console.log(err)
    }

   

    const createdUser = new User({
        username,
        email,
        password: hashedPass,
        posts:[]
    })

    try{
        await createdUser.save()
    }catch(err){
        console.log(err)
    }

    let token;
    token = jwt.sign({userId:createdUser.id}, 'server_whisper')

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token, username:createdUser.username});

}

const login = async (req, res, next) => {
    console.log(req.body)
    if(req.body.token){
        const decodedToken = jwt.verify(req.body.token, 'server_whisper')
        return res.json({ userName:req.body.username, userId: req.body.id, email: req.body.email, token: req.body.token })
    }

    const { email, password } = req.body
    let userExists;

    try{
        userExists = await User.findOne({email: email})
    }catch(err){
        console.log(err)
    }

    let isValidPass = false;

    try{
        isValidPass = await bcrypt.compare(password, userExists.password)
        console.log(isValidPass)
    }catch(err){
        console.log(err)
    }
    
    if(!isValidPass){
        console.log("incorrect pass")
        return 
    }

    let token;
    token = jwt.sign({userId: userExists.id}, 'server_whisper')
    console.log(userExists)
    console.log("I FUCKING RAN")
    res.json({ username: userExists.username, userId: userExists.id, email: userExists.email, token:token })

}

const getUserById = async (req,res, next) =>{

    const currUid = req.body.id
    let user;
    try{    
        user = await User.findById(currUid)
    }catch(err){
        console.log(err)
    }    

    res.json({user: user.toObject({getters:true})})
}

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById