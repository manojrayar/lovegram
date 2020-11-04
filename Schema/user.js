const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[
        { type:ObjectId,ref:"User"}
    ],
    following:[
        {type:ObjectId,ref:"User"}
    ],
    verify:{
        type:Boolean,
        default:false
    },
    token:String,
    tokentime:Date,
    profile:{
        type:String,
        default:"https://res.cloudinary.com/manojrayar/image/upload/v1603462350/guest-user_qjmfvv.jpg"
    }

})

mongoose.model("User",userschema);