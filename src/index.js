const express= require('express')
require('./db/mongoose')

const userRouter=require('./router/user')
const taskRouter=require('./router/task')

const app=express()

//help to get the port dynamic as well as static
const port=process.env.PORT


// app.use((req,res,next)=>{
//     if(req.method==='GET','POST','PATCH','DELETE'){
//         res.send('The Site Is Temporarily Down for Maintainance')
//     }else{
//         next()
//     }

// })

//help to parse the incoming json into object
app.use(express.json())
app.use([userRouter,taskRouter])




app.listen(port,()=>{
    console.log('listening on port'+ port)
})
















