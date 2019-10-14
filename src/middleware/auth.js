const jwt = require('jsonwebtoken')
const user = require('../models/users.js')

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const data =  jwt.verify(token,process.env.JWT_SECRET)
        const user1 = await user.findOne({ _id : data._id ,'tokens.token' : token})
        if(!user1){
           return res.status(400).send('Could not authenticate !!')
        }
        req.token = token
        req.user = user1
        next()
    }
    catch(error){
        res.status(400).send({'error' : error})
    }
}

module.exports = auth