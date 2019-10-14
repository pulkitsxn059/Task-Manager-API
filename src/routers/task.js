const express = require('express')
const task = require('../models/task.js')
const user = require('../models/users.js')
const auth = require('../middleware/auth.js')

const router = new express.Router();

router.get('/test2',(req,res)=>{
    res.send('Task router')
})

router.post('/tasks',auth ,async (req,res)=>{
   // const newtask = new task(req.body)
   const newtask = new task({
       ...req.body,
       owner : req.user._id
   })
    try{
        await newtask.save()
        res.send(newtask)
    }catch(e){
        res.status(400).send(e)
    }
    // console.log(req.body)
    //     newtask.save().then(()=>{
    //         console.log(req.body)
    //         res.send(req.body)
    //         }).catch((error)=>{
    //         res.status(400)
    //         res.send(error)
    //     })
    
    })
    
    // First Method by populate method
    router.get('/tasks/me', auth,async (req,res)=>{
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed == 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] == 'desc' ? -1 : 1 
        }

        try{
            const id = req.user._id
            const user1 = await  user.findById(id)
            await user1.populate({
                path : 'tasks',
                match,
                options : {
                    limit : parseInt(req.query.limit),
                    skip : parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
            res.send(user1.tasks)
        }catch(e){
            res.status(500).send('Internal Server Error')
        }
    })

    // router.get('/tasks/me', auth, async (req,res)=>{
    //     try{
            
    //         const tasks = await task.find({owner : req.user._id})
    //         if(!tasks){
    //             return res.status(404).send('No Task Found !!')
    //         }
    //         res.send(tasks)
    //     }
    //     catch(e){
    //         console.log(e)
    //         res.status(500).send('Internal Server Error !!')
    //     }
    // })

    // router.get('/tasks', auth,async (req,res)=>{
    //     try{
    //         const tasks = await task.find({})
    //         res.send(tasks)
    //     }catch(e){
    //         res.send(500).send('Internal Server Error')
    //     }
    //     // task.find({}).then((tasks)=>{
    //     //     res.send(tasks)
    //     // }).catch(()=>{
    //     //     res.status(500).send('Internal Server Error')
    //     // })
    // })
    
    router.get('/tasks/:id', auth, async (req,res)=>{
        try{
            const _id = req.params.id
            const task1 = await task.findOne({_id : _id,owner : req.user._id})
           // const task1 = await task.findById(_id)
            if(!task1){
                res.status(400).send('No Task Found')
            }
            res.send(task1)
        }catch(e){
            res.status(500).send('Internal Server Error')
        }
        //     task.findById(_id).then((task)=>{
        //     if(!task){
        //         res.status(404).send()
        //     }
        //     res.send(task)
        // }).catch((error)=>{
        //     res.status(500).send('Internal Server Error')
        // })
    })
    
    
    
    router.patch('/tasks/:id',auth ,async (req,res)=>{
        const _id = req.params.id
        const allowedUpdates = ['description','completed']
        const updates = Object.keys(req.body)
        const isValid = updates.every((update)=>{
            return allowedUpdates.includes(update)
        })
        if(!isValid){
            return res.status(400).send('Invalid Update')
        }
        try{

            const task1 = await task.findOne({_id : _id,owner : req.user._id})

            updates.forEach((update)=>{
                task1[update] = req.body[update]
            })

            await task1.save()
            //const task1 = await task.findByIdAndUpdate(_id,req.body,{new:true,runValidators : true})
            if(!task1){
                res.status(404).send('No Task Found!!')
            }
            res.send(task1)
        }catch(e){
            console.log(e)
            res.status(500).send('Internal Server Error!!')
        }
    })



    // router.patch('/tasks/:id',async (req,res)=>{
    //     const _id = req.params.id
    //     const allowedUpdates = ['description','completed']
    //     const updates = Object.keys(req.body)
    //     const isValid = updates.every((update)=>{
    //         return allowedUpdates.includes(update)
    //     })
    //     if(!isValid){
    //         return res.status(400).send('Invalid Update')
    //     }
    //     try{

    //         const task1 = await task.findById(_id)

    //         updates.forEach((update)=>{
    //             task1[update] = req.body[update]
    //         })

    //         await task1.save()
    //         //const task1 = await task.findByIdAndUpdate(_id,req.body,{new:true,runValidators : true})
    //         if(!task1){
    //             res.status(404).send('No Task Found!!')
    //         }
    //         res.send(task1)
    //     }catch(e){
    //         console.log(e)
    //         res.status(500).send('Internal Server Error!!')
    //     }
    // })
    
    router.delete('/tasks/:id', auth,async(req,res)=>{
        const _id = req.params.id
        try{
            const task1 = await task.findOne({_id : _id,owner : req.user._id})
            await task1.remove();
            res.send(task1)
        }catch(e){
             console.log(e)
            res.status(500).send()
        }
    })
    // router.delete('/tasks/:id',async(req,res)=>{
    //     const _id = req.params.id
    //     try{
    //         const task1 = await task.findByIdAndDelete(_id)
    //         if(!task1){
    //             return res.status(404).send('Task Not Found!!')
    //         }
    //         res.send(task1)
    //     }catch(e){
    //         console.log(e)
    //         res.send(500).send('Internal Server Error!!')
    //     }
    // })

    module.exports = router