if(process.env.NODE_ENV=="production"){
    module.exports=require('./produ')
}else{
    module.exports=require('./dev')
}