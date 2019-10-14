const mongoose = require('mongoose')
const validate = require('validator')


mongoose.connect(process.env.MONGODB_URL,{
useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology : true,
useFindAndModify : false
})

// const User = mongoose.model('User',{
//     name : {
//         type : String,
//         trim : true,
//         required : true
//     },
//     Age : {
//         type : Number,
//         validate(value){
//             if(value<0)
//             throw new Error("Age cannot be negative")
//         }
//     },
//     email : {
//         type : String,
//         required : true,
//         trim : true,
//         lowercase  : true,
//         validate(value){
//             if(!validate.isEmail(value)){
//                 throw new Error("Invalid E-mail")
//             }
//         }
//     },
//     password : {
//         type : String,
//         required : true,
//         trim : true,
//         minlength : 6,
//         validate(value){
//             if(value.includes("password")){
//                 throw new Error('password cannot be password')
//             }
//         } 
//     }
// })

// const me  = new User({
//     name : '     Pulkit   ',
//     Age : 23,
//     email : 'pulkit@gmail.com',
//     password : 'mypass123'

// })

// me.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

// const task = mongoose.model('tasks',{
//     description : {
//         type: String,
//         required : true,
//         trim : true
//     },
//     completed :{
//         type :  Boolean,
//         default : false
//     }
// })

// const newtask = new task({
//     description : 'Switch Company',
// })

// newtask.save().then((task)=>{
// console.log(task)
// }).catch((error)=>{
// console.log(error)
// })