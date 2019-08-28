const mongoose=require('mongoose')
var validator = require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    } ,
    age:{
        type: Number
    },
    email: {
        type : String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true,
        validate(value){
            if(validator.isLength(value,[{min: 6, max: undefined}])){
                throw new Error('length must be 6 character')
            }
        },
        validate(value){
          if(value.toLowerCase().includes("password")){
              throw new Error('password word shouldnot be contained')
          }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//creating a method named tokenGenerate to generate the token 
userSchema.methods.tokenGenerate =async function(){
    const user=this
    const token=jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.statics.findByCredit=async (email, password)=>{
    // const user = await mongoose.model("User", userSchema).findOne({ email})
    const user= await User.findOne({email})
    if(!user){
        throw new Error({error: 'unable to login'})
    }
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error({error: 'unable to login'})
    }
    return user
}


//hashing the password before save event
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password=await bcryptjs.hash(user.password,8)

    }
    next()
})

//delete user's task when user delete its profile
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner: user._id})

    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User