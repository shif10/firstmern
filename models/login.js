const mongoose=require("mongoose")


const loginuser=
    mongoose.Schema({
        email:{
            type:String,
            require:true
    
        },
        password:{
            type:String,
            require:true
    
        },

        logintime:{
            type:Date,

        },
        logouttime:{
            type:Date,
            
        }
    })

    module.exports=mongoose.model('Loguser',loginuser);