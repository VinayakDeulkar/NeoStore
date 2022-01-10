const express=require('express')
const router=express.Router();
const {check,validationResult}=require('express-validator')
const userModel=require('../db/userSchema');
const jwt=require('jsonwebtoken')
const jwtSecret='sdsfdsfdsfdsf'
const nodemailer=require('nodemailer')
const path=require('path')
const bcrypt=require('bcrypt')
require('dotenv').config()
const saltRounds = 10;
router.post('/adduser',(req,res)=>{
    let data=req.body;
    let password=req.body.password;
    const hash=bcrypt.hashSync(password,saltRounds)
    let userData=new userModel({firstname:data.firstname,lastname:data.lastname,email:data.email,password:hash,mobileno:data.mobileno,profilepic:'dummy.png',soical:false})
     userData.save((err)=>{
        if(err){
            console.log(err);
            res.status(400).json({err:1,msg:'email must be diffenet'})
        }
        else{
            res.status(200).json({err:0,msg:`${data.firstname} ${data.lastname} Register Successfully`})
        }
    })
})

router.post('/loginuser',(req,res)=>{
    let Email=req.body.email;
    let Password=req.body.password;
    userModel.find({ email:Email,soical:false},(err,data)=>{
        if(!data[0] ){
            res.json({err:1,"msg":"Email or password is not correct"})
        }
        else if(bcrypt.compareSync(Password,data[0].password)){
                let payload={uid:data}
                const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                res.status(200).json({"err":0,"msg":"Login Success","token":token})
            } 
        else{
                res.status(400).json({err:1,"msg":"Password not match"})
            }
            
        
    })
}) 
async function main(email,otp){
    console.log(email);
    console.log(otp);
    let transpoter=nodemailer.createTransport({
        service:'gmail',
        secure:false,
        auth:{
            user:"emperorrock50@gmail.com",
            pass:"EmperorRock50"
        },
        tls:{
            rejectUnauthorized:false
        }
    })
    let mailOptions={
        from:'emperorrock50@gmail.com',
        to:email,
        subject:'OTP for password Recovery',
        text:`Here is the OTP for password recovery ${otp}`
    }
    transpoter.sendMail(mailOptions,(err,data)=>{
        if(err){
            console.log(err);
            console.log('mail not send');
        }
        else{
            console.log('mail sent!!');
        }
    })
}
router.post('/genrateotp',(req,res)=>{
    console.log(req.body.email);
    const digits = '0123456789';
    const otpLength = 4;
    let otp = '';
    for(let i=1; i<=otpLength; i++)
    {
     const index = Math.floor(Math.random()*(digits.length));
     otp = otp + digits[index];
    }
    console.log(otp); 
    userModel.find({email:req.body.email},(err,data)=>{
        if(err){
            res.status(400).json({err:1,msg:'User Not Found'})
        }
        else if(!data[0]){
            res.status(400).json({err:1,msg:'User Not Found'})
        }
        else{
            main(req.body.email,otp)
            res.status(200).json({err:0,msg:`Please check ${req.body.email} email for otp`,otp:otp})
        }
    })
    
})
router.post('/forgettenpass',(req,res)=>{
    console.log(req.body.email.email);
    console.log(req.body.password);
    const hash=bcrypt.hashSync(req.body.password,saltRounds)
    userModel.updateOne({email:req.body.email.email},{$set:{password:hash}},(err)=>{
        if(err){
            res.status(400).json({err:1,msg:'Unable to change password'})
        }
        else{
            res.status(200).json({err:0,msg:`${req.body.email.email} password recover successfully`})
        }
    })
    
})  
function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
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
router.post('/ChangePassword',autenticateToken,(req,res)=>{
    userModel.find({email:req.body.email},(err,data)=>{
        if(err){
            res.status(400).json({err:1,msg:'Email not found'})
        }
        else if(bcrypt.compareSync(req.body.password,data[0].password)){
            const hash=bcrypt.hashSync(req.body.newpassword,saltRounds)
            userModel.updateOne({email:req.body.email},{$set:{password:hash}},(err,data)=>{

                    userModel.find({ email:req.body.email},(err,data)=>{
                        if(!data[0]){
                            console.log('inside email not found');
                            res.status(400).json({err:1,"msg":"Email  is not correct"})
                        }
                        else{
                            let payload={uid:data}
                            const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                            res.status(200).json({"err":0,"msg":"Login Success","token":token})
                            }
                            
                        
                    })
            })
        }
        else{
            res.json({err:1,msg:'Unable to change password'})
        }
    })
    
})
router.post('/deleteAddress',autenticateToken,(req,res)=>{
    userModel.find({ email: req.body.email }, (err, data) => {
        if (err) {
            res.status(400).json({ err: 1, 'msg': "Unable to delete Address" })
        }
        else {
            userModel.updateOne({ email: req.body.email }, {$pull:{Address:{Address_id:req.body.address_id}}}, (err) => {
                if (err) {
                    res.status(400).json({ 'err': 1, "msg": err })
                }
                else {
                    userModel.find({ email:req.body.email},(err,data)=>{
                        if(!data[0]){
                            console.log('inside email not found');
                            res.status(400).json({err:1,"msg":"Unable to genrate jwt"})
                        }
                        else{
                            let payload={uid:data}
                            const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                            res.status(200).json({"err":0,"msg":"Address Deleted Successfully","token":token})
                            }
                    })
                }
            })
        }
    })
    // userModel.find({email:req.body.email},(err,data)=>{
    //     if(err){
    //         res.json({err:1,'msg':"unable to change profile pic"})
    //     }
    //     else{
    //         let finaldata=data[0].Address.filter(ele=>ele.Address_id!==req.body.address_id)
    //         console.log(finaldata);
    //         userModel.updateOne({email:req.body.email},{$set:{Address:finaldata}},(err)=>{
    //             if(err){
    //                 console.log(err);
    //                 res.json({err:1,'msg':"unable to delete address"})
    //             }
    //             else{
    //                 userModel.find({ email:req.body.email},(err,data)=>{
    //                 if(!data[0]){
    //                     console.log('inside email not found');
    //                     res.json({err:1,"msg":"Unable to genrate jwt"})
    //                 }
    //                 else{
    //                     let payload={uid:data}
    //                     const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
    //                     res.status(200).json({"err":0,"msg":"Address Deleted Successfully","token":token})
    //                     }
    //             })
    //             }
    //         })
    //     }
    // })
    
})

router.post('/editAddress',autenticateToken,(req,res)=>{
          console.log(req.body);
          userModel.updateMany({},{$set:{"Address.$[elem].address":req.body.address.address,"Address.$[elem].PinCode":req.body.address.PinCode,"Address.$[elem].City":req.body.address.City,"Address.$[elem].State":req.body.address.State,"Address.$[elem].Country":req.body.address.Country}},{arrayFilters:[{"elem.Address_id":req.body.address.Address_id}]},(err,data)=>{
            if(err){
                        console.log(err);
                        res.status(400).json({err:1,'msg':"unable to Update address"})
                    }
                    else{
                        
                        userModel.find({email:req.body.email},(err,data)=>{
                            if(!data[0]){
                                console.log('inside email not found');
                                res.status(400).json({err:1,"msg":"Unable to genrate jwt"})
                            }
                            else{
                                let payload={uid:data}
                                const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                                res.status(200).json({"err":0,"msg":"Address Updated Successfully","token":token})
                                }
                        })
                    }
          })
})
module.exports=router