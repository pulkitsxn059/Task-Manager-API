const express = require('express')
const multer = require('multer')
const email = require('../emails/account')
const user = require('../models/users.js')
const auth = require('../middleware/auth.js')
const sharp = require('sharp')

const router = new express.Router();

router.get('/test',(req,res)=>{
    res.send('Router for users')
})


router.post('/users', async (req,res)=>{
    const newuser = new user(req.body)
    try{
         await newuser.save()
         const token = await newuser.generateAuthTokens()
         email.sendWelcomeEmail(newuser.email,newuser.name)
         res.send({newuser,token})
    }catch(e){
         res.status(400).send(e)
    }
 //     newuser.save().then(()=>{
 //     res.send(req.body)
 //    }).catch((error)=>{
 //        res.status(400)
 //        res.send(error)
 //    })
 })
 
 router.post('/users/login' , async(req,res)=>{
    //console.log(req,params.email,req.params.password)
    try{
        const user1 =  await user.findByCredentials(req.body.email,req.body.password)
        const token =  await user1.generateAuthTokens()
        res.send({user1,token})  
    }
    catch(e){
        console.log(e)
        res.status(500).send('Internal Server Error !!')
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }

router.post('/users/logoutAll',auth , async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }


})


})
 router.get('/users/me', auth,  async (req,res)=>{
     try{
     //    const users = await user.find({})
        //console.log(req.user)
         res.send(req.user)
      }catch(e){
          console.log(e)
          res.status(500).send('Internal Server Error')
      }
 
     // user.find({}).then((users)=>{
     //     res.send(users)
     // }).catch((error)=>{
     //     res.status(500).send('Internal Server Error')
     // })
 
 })
 
//  router.get('/users/:id',async (req,res)=>{
//      try{
//          const _id = req.params.id
//          const user1 = await user.findById(_id)
//          if(!user1){
//              res.status(404).send('No User Found!!')
//          }
//          res.send(user1)
//      }catch(e){
//          res.status(500).send()
//      }
//      // user.findById(_id).then((user)=>{
//      //     if(!user){
//      //         res.status(404).send()    
//      //     }
//      //     res.send(user)
//      // }).catch((e)=>{
//      //     res.status(500).send()
//      // })
//  })

//  

router.patch('/users/me', auth, async (req,res)=>{
        // const _id = req.params.id;
         const allowedUpdates = ['name','Age','email','password']
         const updates = Object.keys(req.body)
    
         const isValid = updates.every((update)=>{
             return allowedUpdates.includes(update)
         })
          if(!isValid){
             return res.status(400).send('Invalid Update')
         }
         try{
             
             //const user1 = await user.findById(_id)
            
             updates.forEach((update)=>{
                 req.user[update] = req.body[update]
             })
    
             await req.user.save()
            // const user1 = await user.findByIdAndUpdate(_id, req.body,{'new' : true, 'runValidators' : true})
            //  if(!user1){
            //     return res.status(400).send('No such User')
            //  }
    
             res.send(req.user)
         }catch(e){
             console.log(e)
             res.status(500).send('Internal Server Error')
         }
     })
    
router.delete('/users/me', auth, async(req,res)=>{
    try{
        await req.user.remove();
        email.sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send('Internal Server Error')
    }
})

const upload = multer({
  //  dest : 'avatars',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload image of proper file format'))            
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth,upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({'error' : error.message})
})

router.delete('/users/me/avatar',auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const _id = req.params.id
        const user1 = await user.findById(_id)
        if(!user1 || !user1.avatar){
            throw new Error('Content Not Found')
        }

        res.set('Content-Type','image/png')
        res.send(user1.avatar)
    }
    catch(error){
        res.status(404).send()
    }
})
//router.patch('/users/:id',async (req,res)=>{
    //     const _id = req.params.id;
    //     const allowedUpdates = ['name','Age','email','password']
    //     const updates = Object.keys(req.body)
    
    //     const isValid = updates.every((update)=>{
    //         return allowedUpdates.includes(update)
    //     })
    //     if(!isValid){
    //         return res.status(400).send('Invalid Update')
    //     }
    //     try{
             
    //         const user1 = await user.findById(_id)
            
    //         updates.forEach((update)=>{
    //             user1[update] = req.body[update]
    //         })
    
    //         await user1.save()
    //        // const user1 = await user.findByIdAndUpdate(_id, req.body,{'new' : true, 'runValidators' : true})
    //         if(!user1){
    //            return res.status(400).send('No such User')
    //         }
    
    //         res.send(user1)
    //     }catch(e){
    //         console.log(e)
    //         res.status(500).send('Internal Server Error')
    //     }
    // })
    

// router.delete('/users/:id',async (req,res)=>{
//     const _id = req.params.id
//     try{
//         const user1 = await user.findByIdAndDelete(_id)
//         if(!user1){
//             return res.status(404).send('No User Found')
//         }
//         res.send(user1)
//     }catch(e){
//         res.status(500).send('Internal Server Error!!')
//     }
// })



module.exports = router