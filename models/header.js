const mongoose=require("mongoose")

const header=mongoose.Schema({


   sitename:{
    type:String
   },
   home:[{

    label:String,
    url:String,
    enablle:String,


   }]


    
})
module.exports=mongoose.model("header",header)