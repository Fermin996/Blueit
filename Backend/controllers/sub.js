const mongose = require('mongoose')
const Sub = require('../models/sub')

const getSubs = async(req, res, next) => {
    let subs 

    try{
        subs = await Sub.find({})
    }catch(err){
        console.log(err)
    }
    console.log(subs)
    res.json({subs: subs.map(sub => sub.toObject({getters:true}))})
}

const getSubsByQuery=async(req, res, next) => {

}

const getSubById=async(req,res,next)=>{
    let sub
    subId = req.params.id
    console.log(subId)
    try{
        sub = await Sub.findById(subId)
    }catch(err){
        console.log(err)
    }

    res.json({sub: sub.toObject({getters: true})})
}

exports.getSubs = getSubs;
exports.getSubById = getSubById;