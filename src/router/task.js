const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    
    const task=new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
    
    // task.save().then((task)=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)

    // })
})

router.get('/tasks',auth,async(req,res)=>{
const match={}
if(req.query.completed){
    match.completed=req.query.completed==='true'
}
    try {
    //const tasks=await Task.find({owner: req.user._id})
    await req.user.populate({
        path: 'tasks',
        match
    }).execPopulate()

    res.send(req.user.tasks) 
} catch (e) {
    res.status(500).send()
    
}
    
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    //const task=await Task.findById(_id)
    const task=await Task.findOne({_id,owner: req.user._id})
    try {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
   


    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
            
    //     }
    //         res.send(task)
        
        
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id',auth,async(req, res)=>{

const reqEnterProperty=Object.keys(req.body)    
const modelDefineTask=['completed','description']
const IsAllowed=reqEnterProperty.every((property)=>{
   return modelDefineTask.includes(property)
})
if(!IsAllowed){
    return res.status(200).send({error: "You should Provide a allowed information only"})
}


    try {
        const task=await Task.findOne({_id:req.params.id,owner: req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        reqEnterProperty.forEach((property)=>task[property]=req.body[property])
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
       // const task=await Task.findByIdAndDelete(req.params.id)
        const task=await Task.findOneAndDelete({_id:req.params.id,owner: req.user._id})
        if(!task){
           return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router