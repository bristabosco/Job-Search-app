const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Fetch User Profile
router.get('/:email', async (req,res)=>{
   try {
    const user = await User.findOne({email:req.params.email})
    if(!user) return res.status(404).json({message:'User not found'})
    res.json(user)
   } catch (error) {
    res.status(500).json({message:error.message})
   }
})

//update user profile
router.put('/:email',async (req,res)=>{
    try {
        const{name,phone,profileImage,resume} = req.body;
        const user = await User.findByIdAndUpdate({
            email:req.params.email},
            {name:phone,profileImage,resume},
        {new:true}
        );
        res.json(user)
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
})

module.exports = router;