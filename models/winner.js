const mongoose=require("mongoose")

const winner=mongoose.Schema({

c_id:{
    type:Object
},
    name: {
        type: String,
        required: true,
      },
      share:{
        type:Number,
        required:true,
      },
      email:{
        type:String,
        require:true,
    
      },
     
      age:{
        type:Number
    
      },
     
      description:{
        type:String,
        default:"Welcomes the our new broad directors ,now they will conduct you duide you that you are choosen",
      },
      image:{     
        type:String
      }
    
    
    
    





})

module.exports=mongoose.model("winner",winner)