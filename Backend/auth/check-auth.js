const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{

    try{
        const token = req.header.authorization.split(' ')[1]
        if(!token){
            console.log("mega error")
        }

        const decodedToken = jwt.verify(token, 'server_whisper')
        req.userData = {userId: decodedToken.userId}
        next()
    }catch(err){
        console.log(err)
    }
    
}