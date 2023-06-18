const mongoose=require('mongoose')


const regituser=mongoose.Schema({
    firstname:{
        type:String,
        require:true

    },
    lastname:{
        type:String,
        require:true

    },
    birthday:{
        type:Date,
        require:true

    },
    gender:{
        type:String,
        require:true

    },
    phone:{
        type:Number,
        require:true

    },
    email:{
        type:String,
        require:true

    },
    password:{
        type:String,
        require:true

    },
    state:{
        type:String,
        require:true

    },
    city:{
        type:String,
        require:true

    },
    image:{
        type:String,
        require:true

    },
    is_admin:{
        type:Number,
        require:true
    },

    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:0
    },
    otp:{
        type:Number,
        default:0
    }



})


module.exports=mongoose.model('Reguser',regituser);