const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=mongoose.model('User')
const jwt=require('jsonwebtoken')
const {JWT_SKEY,sendgrid,DOMAIN}=require('../configkeys/keys')
const signinMiddleWare=require('../Middlewares/signin')
const nodemailer=require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto=require('crypto');
const { Buffer } = require('buffer');


const transport=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:sendgrid
    }
}))

// router.get('/',(req,res)=>{
//     res.send('Hello from router');
// })

// router.get('/protected',signinMiddleWare,(req,res)=>{
//     res.json("welcome to protected")
// })


router.post('/signup',(req,res)=>{
    console.log(req.body)
    const {name,email,password}=req.body
    if(!name||!email||!password){
        return res.status(422).json({error:"please add all field"})
    }
   
    User.findOne({email:email})
    .then((saveduser)=>{
        if(saveduser){
            return res.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,13)
        .then(hassedpwd=>{
            // console.log(hassedpwd)
            
                    const user=new User({
                        name:name,
                        email:email,
                        password:hassedpwd
                    })
            
                    user.save()
                    .then(user=>{

                        const token=crypto.randomBytes(23).toString('hex')
                        // console.log(token)

                        user.token=token
                        user.save().then(result=>{
                                transport.sendMail({
                                to:user.email,
                                from:"manoj2kbgm@gmail.com",
                                subject:"Welcome message",
                                html:`<h1>Welcome to Lovegram site, <p>Click on this <a href="${DOMAIN}/verify/${token}">Link</a> to verify your E-mail.</p> </h1>`
                            }).then(res=>{
                                console.log(res)
                                })
                        })
                        res.json({message:"Check your email to verify your account "})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
        })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(422).json({error:"Please fill all the fields"});
    }
    User.findOne({email:email})
    .then(saveduser=>{
        if(!saveduser){
            return res.json("Invalid email or password")
        }
        bcrypt.compare(password,saveduser.password)
        .then(match=>{
            if(match){
                // res.json("You have signned in successfuly");
                if(saveduser.verify==true){
                    const token=jwt.sign({_id:saveduser._id},JWT_SKEY)
                    const {_id,name,email,followers,following,profile}=saveduser;
                    res.json({message:"Signed in success",token:token,user:{_id,name,email,followers,following,profile}})
                }else{
                    res.json({error:"Sign-up first"})
                }
            }else{
                res.json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

// Uploading user profile picture
router.put('/updateprofile',signinMiddleWare,(req,res)=>{
    // console.log(req.body.pic)
    User.findByIdAndUpdate(req.user._id,{
        $set:{profile:req.body.pic}
    },{
        new:true
    })
    .select("-password")
    .exec((err,profile)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(profile)
    })
    
})

router.put('/verifyemail',(req,res)=>{
    console.log(req.body)
    User.findOneAndUpdate({token:req.body.token},{
        $set:{verify:"true"}
    },{
        new:true
    })
    .select("-password")
    .exec((err,user)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})
        }
        console.log(user)
        res.json(user)
    })
})

router.post('/resetpassword',(req,res)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.json({error:"User not found with this email"})
        }
        const token=crypto.randomBytes(26).toString('hex');
        user.token=token;
        user.tokentime=Date.now()+600000;

        user.save().then(result=>{
            transport.sendMail({
                to:user.email,
                from:"manoj2kbgm@gmail.com",
                subject:"Password Reset",
                html:`<p>Click on this <a href="${DOMAIN}/newpassword/${token}">Link</a> to reset your password.</p>`
            }).then(res=>{
                console.log(res)
            })
        })
        res.json({message:"Check your e-mail to reset the password"})
    })
})

router.put('/set-newpassword',(req,res)=>{
    User.findOne({token:req.body.token})
    .then(user=>{
        if(!user){
            return res.json({error:"Something went wrong"})
        }

        if(user.tokentime<Date.now()){
            return res.json({error:"Token Expired"})

        }

        bcrypt.hash(req.body.password,13)
        .then(hassedpwd=>{
            user.password=hassedpwd
            user.save().then(result=>{
                res.json({message:"Password reseted successfully"})

            })
        })
    })
})

router.post('/search-users',(req,res)=>{
    let searchpattern=new RegExp("^"+req.body.query);

    User.find({name:{$regex:searchpattern}})
    .then(users=>{
        res.json({users:users})
    })
    .catch(err=>{
        console.error(err);
    })
})

module.exports=router