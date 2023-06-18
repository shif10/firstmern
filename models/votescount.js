const mongoose=require('mongoose')

const votescount=new mongoose.Schema({
   
    c_id:{

        type:Object,


    },

    number:{
        type:Number,
        default:0,
        

    }






})

module.exports=mongoose.model("votescount",votescount)