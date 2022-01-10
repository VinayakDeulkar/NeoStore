const express=require('express')
const router=express.Router();
const categoryModel=require('../db/categorySchema')

router.get('/getcategory',(req,res)=>{
    categoryModel.find()
    .then(category=>{
        res.status(200).json({data:category})
    })
})
module.exports=router