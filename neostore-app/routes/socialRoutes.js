const express=require('express')
const router=express.Router();
const jwt=require('jsonwebtoken')
const jwtSecret='sdsfdsfdsfdsf'
const multer=require('multer')
const path=require('path')
const userSchema=require('../db/userSchema')
function autenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (token == null) {
      res.json("Token not Found");
    } else {
      jwt.verify(token, jwtSecret, (err, data) => {
        if (err) {
          res.json("Token Not Matched");
        } else {
          console.log("Token Match ");
          next();
        }
      });
    }
  }
router.post('/usersociallogin',(req,res)=>{
    console.log(req.body);
    userSchema.find({email:req.body.email},(err,data)=>{
        if(err){
            console.log('inside error');
            res.status(400).json({err:1,msg:'Unable to login'})
        }
        else if(!data[0]){
            console.log('inside reg');
            let userData=new userSchema({firstname:req.body.firstName,lastname:req.body.lastName,email:req.body.email,soical:true})
            userData.save((err)=>{
                if(err){
                    console.log('inside email must be diffenet');
                    res.status(400).json({err:1,msg:'email must be diffenet'})
                }
                else{
                    console.log('inside email must be else');
                    userSchema.find({ email:req.body.email},(err,data)=>{
                        if(!data[0]){
                            console.log('inside email not found');
                            res.status(400).json({err:1,"msg":"Email  is not correct"})
                        }
                        else{
                            console.log('inside reg token');
                            let payload={uid:data}
                            const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                            res.status(200).json({"err":0,"msg":`${req.body.firstName} ${req.body.lastName}Login Success`,"token":token})
                            }
                            
                        
                    })
                }
            })
        }
        else if(data[0].soical==true){
            console.log('inside login');
            let payload={uid:data}
            const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
            res.status(200).json({"err":0,"msg":"Login Success","token":token})
        }
        else{
            res.json({err:1,"msg":"Try to Login with password"})
        }
    })
})
router.post('/profileupdate',autenticateToken,(req,res)=>{
    console.log(req.body);
    userSchema.updateMany({email:req.body.email},{$set:{firstname:req.body.firstname,lastname:req.body.lastname,mobileno:req.body.mobileno}},(err,data)=>{
        if(err){
            console.log(err);
            res.status(400).json({err:1,msg:'Unable to Update profile'})
        }
        else{
            console.log('inside else');
            userSchema.find({ email:req.body.email},(err,data)=>{
                if(!data[0]){
                    console.log('inside email not found');
                    res.status(400).json({err:1,"msg":"Unable to genrate jwt"})
                }
                else{
                    console.log('inside reg token');
                    let payload={uid:data}
                    const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                    res.status(200).json({"err":0,"msg":"Profile updated successfully","token":token})
                    }
                    
                
            })
        }
    })
})
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/Full stack/FinalProduct/finalproject/public/Image/')
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        console.log(filename);
        cb(null, filename)
    }
})
var upload=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
})
router.post('/UpdateProfilePic',autenticateToken,upload.single('file'),(req,res)=>{
    console.log(req.body);
    console.log(req.file.filename);
    userSchema.updateOne({ email: req.body.email }, { $set:{profilepic:req.file.filename} }, (err) => {
        if(err){
            res.status(400).json({err:1,'msg':"unable to change profile pic"})
        }
        else{
            userSchema.find({ email:req.body.email},(err,data)=>{
            if(!data[0]){
                console.log('inside email not found');
                res.status(400).json({err:1,"msg":"Unable to genrate jwt"})
            }
            else{
                let payload={uid:data}
                const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                res.status(200).json({"err":0,"msg":"Profile Picture updated successfully","token":token})
                }
                
            
        })
        }
    })
})
router.post('/addAddress',autenticateToken,(req,res)=>{
          
    userSchema.find({email:req.body.email},(err,data)=>{
        if(err){
            res.status(400).json({err:1,'msg':"unable add  address"})
        }
        else{
            let addressData={Address_id:Math.random(),address:req.body.ADDRESS.address,PinCode:req.body.ADDRESS.PinCode,City:req.body.ADDRESS.City,State:req.body.ADDRESS.State,Country:req.body.ADDRESS.Country}
            data[0].Address.push(addressData)
            console.log(data);
            userSchema.updateOne({email:req.body.email},{$set:{Address:data[0].Address}},(err)=>{
                if(err){
                    console.log(err);
                    res.status(400).json({err:1,'msg':"unable to change profile pic"})
                }
                else{
                    userSchema.find({ email:req.body.email},(err,data)=>{
                    if(!data[0]){
                        console.log('inside email not found');
                        res.status(400).json({err:1,"msg":"Unable to genrate jwt"})
                    }
                    else{
                        let payload={uid:data}
                        const token=jwt.sign(payload,jwtSecret,{expiresIn:360})
                        res.status(200).json({"err":0,"msg":"Address Added","token":token})
                        }
                })
                }
            })
        }
    })
    
})
module.exports=router