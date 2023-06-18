const mongoose=require('mongoose')

const votes=new mongoose.Schema({
    v_id:{
        type:Object
    },
    c_id:{

        type:Object,


    },

    number:{
        type:Number,
        default:0,
        

    }






})

module.exports=mongoose.model("votes",votes)