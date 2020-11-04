const express=require('express')
const mongoose=require('mongoose')
const {mongoURL}=require('./configkeys/keys')
const port=process.env.PORT || 4000
require('./Schema/user')
require('./Schema/post')
// const authroutes=require('./Routes/auth')





mongoose.connect(mongoURL,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected",()=>{
    console.log("connected to MongoDB");

})
mongoose.connection.on("error",(e)=>{
    console.log("failed",e);

})
mongoose.set("useFindAndModify",false);

const App=express();
App.use(express.json())

App.use(require('./Routes/auth'))
App.use(require('./Routes/post'))
App.use(require('./Routes/uprofile'))


const customMiddleWare=(req,res,next)=>{
    console.log("MiddleWare is executed");
    next();
}

// App.use(customMiddleWare)


// App.get('/',(req,res)=>{
//     console.log("Get executed")
//     res.send("Hello Manoj");

// })

// App.get('/about',customMiddleWare,(req,res)=>{
//     console.log("about page");
//     res.send("this is About Page");
// })

if(process.env.NODE_ENV=="production"){
    App.use(express.static('client/build'))
    const path=require('path')
    App.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


App.listen(port,()=>{
    console.log("Server is running");
})
