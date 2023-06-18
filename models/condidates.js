const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
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
  member_id:{
    type:String
    
  },
  age:{
    type:Number

  },
  origin:{
    type:String,
    require:true,
  },
  
  education:{
    type:String,
    require:true,
  },
  gender:{
    type:String,
    require:true,
  },
  description:{
    type:String,
    default:0,
  },
  image:{     
    type:String
  }





 
})

module.exports = mongoose.model('condidates',UserSchema)

