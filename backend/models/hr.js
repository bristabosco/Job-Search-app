const mongoose = require('mongoose')

const HRProfileSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        
    },
    phone:{
        type:String,
       
    },
    company:{
        type:String,
       
    },
    image:{
        type:String,
    }
})

module.exports= mongoose.model('HRProfile',HRProfileSchema)
