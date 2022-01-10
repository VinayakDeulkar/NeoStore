const express=require('express')
const router=express.Router();
const productModel=require('../db/productSchema')
const categoryModel=require('../db/categorySchema')
const colorModel=require('../db/colorSchema')
const jwt=require('jsonwebtoken')
const jwtSecret='sdsfdsfdsfdsf'

router.get('/getProduct',(req,res)=>{
    productModel.find()
    .populate(["category_id","color_id"])
    .then(product=>{
        // console.log(product);
        res.status(200).json({data:product})
    })
})
router.post('/FilterProduct',(req,res)=>{
    console.log(req.body);
    productModel.find()
        .populate(["category_id","color_id"])
        .then(product=>{
        console.log(product);
        if(req.body.category_name!='' &&req.body.color_name==''){
            let filterData=product.filter(pro => pro.category_id.category_name==req.body.category_name);
           
            res.status(200).json({data:filterData})
        }
        else if(req.body.category_name=='' &&req.body.color_name!=''){
            let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name);
            
            res.status(200).json({data:filterData})
        }
        else{
            let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name && pro.category_id.category_name==req.body.category_name);
            
            res.status(200).json({data:filterData})
        }
        })

    
})
router.get('/getpopularproduct',(req,res)=>{
    productModel.find()
    .populate(["category_id","color_id"])
    .then(product=>{
        // console.log(product);
        let filterData=product.filter(pro=>pro.product_rating>=4)
        res.status(200).json({data:filterData})
    })
})
 
function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    console.log('inside autenticateToken');
    if (token == null) {
      res.status(404).json("Token not Found");
    } else {
      jwt.verify(token, jwtSecret, (err, data) => {
        if (err) {
          res.status(400).json("Token Not Matched");
        } else {
          console.log("Token Match ");
          next();
        }
      });
    }
  }
router.post('/setrating',autenticateToken,(req,res)=>{
    productModel.updateOne({_id:req.body.product_id},{$set:{product_rating:req.body.product_rating}},(err)=>{
        if(err){
            res.status(400).json({err:1,msg:'Unable to change rating'})
        }
        else{
            res.status(200).json({err:0,msg:'Rating change sucessfully'})
        }
    })
    console.log(req.body);
})
module.exports=router