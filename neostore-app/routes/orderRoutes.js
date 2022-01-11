const express=require('express')
const router=express.Router();
const orderModel=require('../db/orderSchema')
const jwt=require('jsonwebtoken')
const jwtSecret='sdsfdsfdsfdsf'
router.post('/confirmorder',(req,res)=>{
    let OrderData=new orderModel({customer_id:req.body.customer_id,product_id:req.body.product_id,delivery_address:req.body.delivery_address,isDelivered:false,total_Productcost:req.body.total_Productcost})
     OrderData.save((err)=>{
        if(err){
            console.log(err);
            res.status(400).json({err:1,msg:'email must be diffenet'})
        }
        else{
            res.status(200).json({err:0,msg:'Order Confirmed'})
        }
    })
    
})
router.post('/orderdetails',(req,res)=>{
    console.log(req.body);
    orderModel.find({customer_id:req.body.id},(err,data)=>{
        if(err){
            console.log(err);
            res.status(400).json({err:1,msg:'email must be diffenet'})
        }
        else{
            res.status(200).json({err:0,order:data})
        }
    })
    
})
module.exports=router