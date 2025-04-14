const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:String,
    timestamp:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('notification',NotificationSchema)