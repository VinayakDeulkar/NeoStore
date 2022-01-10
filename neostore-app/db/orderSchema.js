const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdata"
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    delivery_address:{
        type:String,
        required:true
    },
    product_cost:{
        type:Number,
        required:true
    },
    total_Productcost:{
        type:Number,
        required:true
    },
    order_date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Cart',orderSchema);