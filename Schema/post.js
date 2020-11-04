const { text } = require('express')
const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types

const postschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    comments:[
        {text:String,
        postedby:{type:ObjectId,ref:"User"} }
    ],
    likes:[
        {type:ObjectId, ref:"User"}
    ],
    photo:{
        type:String,
        required:true
    },
    postedby:{
        type:ObjectId,
        ref:"User"
        
    }
},{timestamps:true})

mongoose.model("Post",postschema)