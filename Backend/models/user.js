const mongoose = require("mongoose");
// const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{type: String, required: true},
    password:{type: String, required: true, minlength:6},
    email:{type: String, required: true, unique:true},
    posts:[{type: mongoose.Types.ObjectId, required:true, ref:"Post"}],
    comments:[{type: mongoose.Types.ObjectId, required:true, ref:"Comment"}],
    votes:[{type:mongoose.Types.ObjectId, ref:"Post", voteType:String}]
    //cakeDay:{type: Date, required: true}
})

// userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)