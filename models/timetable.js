
const mongoose = require('mongoose');
const timetable = new mongoose.Schema({
    Rounds: {
      type: Number,
      required: true,
    }, 
     date: {
      type: Date,
      required: true,
    },
    Time: {
      type: String,
      required: true,
    },
    Lastdate: {
      type: Date,
      required: true,
    },
    Resultdate: {
      type: Date,
    
    },
  })

  module.exports = mongoose.model('timetable',timetable)