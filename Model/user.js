const mongoose=require('../Dbconnection')
const bcrypt=require('bcryptjs')
require('dotenv').config()
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },

    password:{
        type:String,
    },
    role:{
   type:Number,
   default:0
    },
    
    profileImage:{
        data: Buffer,
        contentType: String
    }

},{timestamps:true})




userSchema.pre('save',async function (next){
    const user=this;
    if(user.isModified('password')){

    user.password=await bcrypt.hash(user.password,8)
    }
    next()
})


const User=mongoose.model('User',userSchema,'User')
module.exports={User}