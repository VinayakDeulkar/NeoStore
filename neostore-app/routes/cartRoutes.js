const express=require('express')
const router=express.Router();
const cartModel=require('../db/cartSchema')

router.post('/addtocart',(req,res)=>{
    console.log(req.body);
    cartModel.find({customer_id:req.body.customer_id,product_id:req.body.product_id},(err,data)=>{
        if(err){
            res.status(400).json({err:1,msg:'Error Occured'})
        }
        else if(data[0]){
            
            data[0].quantity=data[0].quantity+1;
            data[0].total_Productcost=(data[0].quantity*data[0].product_cost)
            if(data[0].quantity>=1 && data[0].quantity<=10){
                cartModel.updateMany({customer_id:req.body.customer_id,product_id:req.body.product_id},{$set:{quantity:data[0].quantity,total_Productcost:data[0].total_Productcost}},(err)=>{
                    if(err){
                        console.log(err);
                        res.status(400).json({err:1,msg:'unable to insert'})
                    }
                    else{
                        res.status(200).json({err:0,msg:' product added success fully'})
                    }
                })
            }
            else{
                res.status(400).json({err:1,msg:'You can only add 10 product quantity at a time'})
            }
        }
        else{
            console.log(req.body.customer_id);
            let userData=new cartModel({customer_id:req.body.customer_id,product_id:req.body.product_id,product_cost:req.body.product_cost,quantity:1,total_Productcost:req.body.product_cost})
            userData.save((err)=>{
               if(err){
                   console.log(err);
                   res.status(400).json({err:1,msg:'unable to insert'})
               }
               else{
                   res.status(200).json({err:0,msg:' product added success fully'})
               }
           })
        }
    })
})
router.post('/cartcount',(req,res)=>{
    console.log('inside cart count');
    console.log(req.body.id);
    cartModel.find({customer_id:req.body.id})
    .populate(["product_id"])
    .then(cart=>{
        console.log(cart.length),
        res.status(200).json({err:1,count:cart.length})
    })
})
router.post('/changeuuid',(req,res)=>{
    console.log(req.body);
    cartModel.updateMany({customer_id:req.body.cartid},{$set:{customer_id:req.body.id}},(err)=>{
        if(err){
            res.status(400).json({err:1,msg:'unable to login'})
        }
        else{
            res.status(200).json({err:0,msg:'cart edited'})
        }
    })
})
router.post('/getCart',(req,res)=>{
    console.log(req.body);
    cartModel.find({customer_id:req.body.id})
    .populate(["product_id"])
    .then(cart=>{
        res.status(200).json({err:1,cartData:cart})
    })
})
router.post('/incquantity',(req,res)=>{
    console.log(req.body);
    cartModel.find({_id:req.body.id},(err,data)=>{
        if(err){
            res.status(400).json({err:1,msg:'Error Occured'})
        }
        else{
            data[0].quantity=data[0].quantity+1;
            data[0].total_Productcost=(data[0].quantity*data[0].product_cost)
            if(data[0].quantity>=1 && data[0].quantity<=10){
                cartModel.updateMany({_id:req.body.id},{$set:{quantity:data[0].quantity,total_Productcost:data[0].total_Productcost}},(err)=>{
                    if(err){
                        console.log(err);
                        res.status(400).json({err:1,msg:'unable to insert'})
                    }
                    else{
                        res.status(200).json({err:0,msg:' product quantity added success fully'})
                    }
                })
            }
            else{
                res.status(400).json({err:1,msg:'You can only add 10 product quantity at a time'})
            }
        }
    })
})
router.post('/decquantity',(req,res)=>{
    console.log(req.body);
    cartModel.find({_id:req.body.id},(err,data)=>{
        if(err){
            res.status(400).json({err:1,msg:'Error Occured'})
        }
        else{
            data[0].quantity=data[0].quantity-1;
            data[0].total_Productcost=(data[0].quantity*data[0].product_cost)
            if(data[0].quantity>=1 && data[0].quantity<=10){
                cartModel.updateMany({_id:req.body.id},{$set:{quantity:data[0].quantity,total_Productcost:data[0].total_Productcost}},(err)=>{
                    if(err){
                        console.log(err);
                        res.status(400).json({err:1,msg:'unable to insert'})
                    }
                    else{
                        res.status(200).json({err:0,msg:' product quantity subtracted success fully'})
                    }
                })
            }
            else{
                res.status(400).json({err:1,msg:'You can only add 10 product quantity at a time'})
            }
        }
    })
})
router.post('/deleteItem',(req,res)=>{
    console.log(req.body);
    cartModel.deleteOne({_id:req.body.id},(err)=>{
        if(err){
            res.status(400).json({err:1,msg:'Unable to delete'})
        }
        else{
            res.status(200).json({err:0,msg:'Item Delete successfully'})
        }
    })
})
module.exports=router