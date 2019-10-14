const express = require('express')
const user = require('./models/users.js')
const task = require('./models/task.js')
require('./db/mongoose.js')
const userRouter = require('./routers/users.js')
const taskRouter = require('./routers/task.js')

const app = express();
const port = process.env.PORT

// Express Middleware

// app.use( (req,res,next)=>{
//     if(req.method == 'GET'){
//         res.send('GET methods are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Site Under Maintainence !!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//const bcrypt = require('bcryptjs')

// const Func = (async()=>{
//     const password = "mypass123"
//     const hashedpassword = await bcrypt.hash(password,8)

//     console.log(password)
//     console.log(hashedpassword)

//     const isMatch = await bcrypt.compare("767hyiu",hashedpassword)
//     console.log(isMatch) 

// })

// Func()


// const jwt = require('jsonwebtoken')

// const Func = (()=>{
//     const token = jwt.sign({'id' : 'abc123'},'pulkitsaxena',{ 'expiresIn' :'7 seconds'})
//     console.log(token)

//     const data = jwt.verify(token, 'pulkitsaxena')
//     console.log(data)
// })

// Func()

// const Task  = require('./models/task.js')
// const User = require('./models/users.js')

// const main = async ()=>{

//     // const task = await Task.findById("5d9c3af5ba4bee076038dc28")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById("5d9c393f26080109941edddf")
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()



//Code For File Uploads

// const multer = require('multer')
// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             cb(new Error('Please Upload a Doc File'))
//         }
//         // if(!file.originalname.endsWith('.pdf')){
//         //     cb(new Error('Please upload a PDF !!'))
//         // }

//         cb(undefined,true)
//     }
// })

// app.post('/upload', upload.single('upload')  ,(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({'error' : error.message})
// })



app.listen(port,()=>{
    console.log('Server has Started port '+port)
})
