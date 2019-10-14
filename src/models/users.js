const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')

const userSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            required : true,
            trim :true
        },
        email : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email !!')
            } 
        }
    },
    Age : {
            type: Number,
            validate(value){
                if(value<0){
                    throw new Error('Invalid Age !!')
                }
            }
        },
    password : {
        type : String,
        required : true,
        minlength : 6,
        trim : true,
        validate(value){
            if(value.includes('password')){            
            throw new Error('Invalid Password !!')
        }88
    }
    },
    tokens : [{
        token :{
            type : String,
            required : true
        } 
    }],
    avatar : 
    {
        type : Buffer
    }      
    },{
        timestamps : true
    })

userSchema.virtual('tasks',{
    'ref' : 'tasks',
    'localField' : '_id',
    'foreignField' : 'owner'
}) 

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}
userSchema.methods.generateAuthTokens = async function(){
    const user = this
    const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})

    user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    //console.log(email,password)
    try{
        const user1 = await user.findOne({email})
        
        if(!user1){
            throw new Error('Unable to login !!')
        }

        const isMatch = await bcrypt.compare(password,user1.password)

        if(!isMatch){
            throw new Error('Unable to login !!')
        }

        return user1

    }catch(e){
        console.log(e)
        throw new Error('Internal Server Error !!')
    }
}


// Convert Plain Text Password to a Hashed Password  
userSchema.pre('save' , async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

//Delete all tasks when remvoing a user
userSchema.pre('remove',async function(next){
    const user = this
    const tasks = await Task.deleteMany({owner : user._id})
    next()
})

const user = mongoose.model( 'user', userSchema)

module.exports = user