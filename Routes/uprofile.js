const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const signinMiddleWare=require('../Middlewares/signin')
const Post=mongoose.model("Post")
const User=mongoose.model('User')

router.get('/profile/:id',signinMiddleWare,(req,res)=>{
    // console.log(req.params.id)
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedby:req.params.id})
        .populate("postedby","_id name")
        .exec((error,posts)=>{
            if(error){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
            
        })
        }).catch(err=>{
            res.status(422).json({error:err})
        
    }).catch(err=>{
        res.status(404).json({error:"User not found"})
    })
})


router.put('/follow',signinMiddleWare,(req,res)=>{
        User.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{
            new:true
        })
        .select("-password")
        .exec((err,user1)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{
                new:true
            })
            .select("-password")
            .exec((err,user2)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                res.json({user1,user2})
            })
        })
})


router.put('/unfollow',signinMiddleWare,(req,res)=>{
        User.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
        },{
            new:true
        })
        .select("-password")
        .exec((err,user1)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followId}
            },{
                new:true
            })
            .select("-password")
            .exec((err,user2)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                res.json({user1,user2})
            })
        })
})







module.exports=router