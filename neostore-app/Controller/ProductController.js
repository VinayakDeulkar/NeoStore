// const productModel=require('../db/productSchema')

// const GET_PRODUCT=async(req,res)=>{
//     let DATA
//     await productModel.find({})
//     .populate(["category_id","color_id"])
//     .then(product=>{
//         DATA=product
//     })
//     return DATA
// }
// const FILTER_PRODUCT=async(req,res)=>{
//     let DATA
//     await productModel.find()
//         .populate(["category_id","color_id"])
//         .then(product=>{
//         if(req.body.category_name!='' &&req.body.color_name==''){
//             let filterData=product.filter(pro => pro.category_id.category_name==req.body.category_name);
//             console.log(filterData);
//            DATA=filterData
//             res.status(200).json({data:filterData})
//         }
//         else if(req.body.category_name=='' &&req.body.color_name!=''){
//             let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name);
//             console.log(filterData);
//             DATA=filterData
//             res.status(200).json({data:filterData})
//         }
//         else{
//             let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name && pro.category_id.category_name==req.body.category_name);
//             DATA=filterData
//             console.log(filterData);
//             res.status(200).json({data:filterData})
//         }
//         })
//         // return DATA
// }
// const GET_POPULAR_PRODUCT=async()=>{
//     let DATA
//     await productModel.find({})
//     .populate(["category_id","color_id"])
//     .then(product=>{
//         // console.log(product);
//         let filterData=product.filter(pro=>pro.product_rating>=4)
//         DATA=filterData
//         // res.status(200).json({data:filterData})
//     })
//     return DATA
// }
// module.exports={GET_PRODUCT,FILTER_PRODUCT,GET_POPULAR_PRODUCT}