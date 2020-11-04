const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const signinMiddleWare=require('../Middlewares/signin')
const Post=mongoose.model("Post")

router.get('/mypost',signinMiddleWare,(req,res)=>{
    Post.find({postedby:req.user._id})
    .then(result=>{
        res.json({post:result})
    })

})

router.post('/allpost',signinMiddleWare,(req,res)=>{
    Post.find()
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort("-updatedAt")
    .then(result=>{
        res.json({posts:result})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.post('/myfollowing',signinMiddleWare,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .then(result=>{
        res.json({posts:result})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.post('/createpost',signinMiddleWare,(req,res)=>{
    const {title,body,pic}=req.body;
    console.log(title,body,pic);
    if(!title||!body||!pic){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    // console.log(req.user)
    // res.send("ok")
    
    req.user.password=undefined
    const post=new Post({
        title:title,
        body:body,
        photo:pic,
        postedby:req.user

    })
    post.save().then(saveddata=>{
        res.json(saveddata)
    })

})

// like and dislike 

router.put('/like',signinMiddleWare,(req,res)=>{
    // console.log(req.body.postId)
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',signinMiddleWare,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put('/comment',signinMiddleWare,(req,res)=>{
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',signinMiddleWare,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedby","_id name")
    .exec((err,post)=>{
        if(err||!post){
            // console.log(err)
            return res.status(422).json({error:err})
        }else{
            if(post.postedby._id.toString()==req.user._id.toString()){
                post.remove()
                .then(result=>{
                    // console.log(res)
                    res.json(result)
                })
                .catch(err=>{
                    console.log(err)
                })
                
            }
        }

    })

})


router.delete('/deletecomment/:postId/:cmtId',signinMiddleWare,(req,res)=>{

    Post.findByIdAndUpdate(req.params.postId,{
        $pull:{"comments":{_id:req.params.cmtId}}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
  

})

module.exports=router