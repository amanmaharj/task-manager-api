const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const {sendWelcomeEmail,sendByeEmail}=require('../emails/account')
const router=new express.Router()


router.post('/users',async (req,res)=>{
    const me=new User(req.body)
   
    try {
        await me.save()
        sendWelcomeEmail(me.email,me.name)

        const token=await me.tokenGenerate()
        res.status(201).send({me,token})
    } catch (e) {
        res.status(400).send(e)
    }
 
     // me.save().then((me)=>{
     //     res.status(201).send(me)
     // }).catch((e)=>{
     //     res.status(400).send(e)
     // })
 })

 router.post('/users/login',async(req,res)=>{
     try {  
         const user= await User.findByCredit(req.body.email,req.body.password)
         const token=await user.tokenGenerate()
         res.send({user,token})
     } catch (e) {
         res.status(400).send()
     }
 }) 

 router.post('/users/logout',auth,async(req,res)=>{
     try {
        req.user.tokens=req.user.tokens.filter((token)=>{
          return  token.token!==req.token
         })
        await req.user.save()
        res.send()
 } catch (e) {
     res.status(500).send()
 }
    
 })

 router.post('/users/logoutAll',auth,async(req,res)=>{
     try {
         req.user.tokens=req.user.tokens.filter((token)=>{
             return !token.token
         })
         await req.user.save()
         res.send()
     } catch (e) {
         res.status(500).send()
         
     }
 })

 
//this route is used to get your own profile
 router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
 })

 //this route is used to list all the users that are present in the database
 router.get('/users',auth,async(req,res)=>{
    try {
     const user=await User.find({})
     res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
     
     // User.find({}).then((users)=>{
     //     res.status(200).send(users)
     // }).catch((e)=>{
     //     res.status(500).send(e)
     // })
 })
 
 
 router.patch('/users/me',auth,async(req,res)=>{
 
     const updates= Object.keys(req.body)
     const allowedInput=['name','email','password','age']
     const isValidOperation = updates.every((update)=>allowedInput.includes(update))
     if(!isValidOperation){
        return res.status(400).send({error: 'You should Provide the valid input'})
     }
 
     try {
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()
           res.send(req.user)
        } catch (e) {
            res.status(400).send()
        } 
 
    })

 
 router.delete('/users/me',auth,async(req,res)=>{
    
    try {
    await req.user.remove()
        sendByeEmail(req.user.email,req.user.name)
    res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
 })
 
 
 

module.exports=router