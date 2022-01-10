const express=require('express')
const router=express.Router();
const colorModel=require('../db/colorSchema')

router.get('/getcolor',(req,res)=>{
    colorModel.find()
    .then(color=>{
        res.status(200).json({data:color})
    })
})
module.exports=router