// const userSchema=require('../db/userSchema');

// const addUser=async(data)=>{
//     console.log('insider controller');
//    console.log(data);
//    let userData=new userSchema({firstname:data.firstname,lastname:data.lastname,email:data.email,password:data.password,mobileno:data.mobileno})
//    await userData.save((err)=>{
//        if(err){
//            return({err:1,msg:'email must be diffenet'})
//        }
//        else{
//            return({err:0,msg:'Data added success fully'})
//        }
//    })
// } 
// module.exports={
//     addUser
// }