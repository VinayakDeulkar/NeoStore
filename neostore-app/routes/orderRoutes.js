const express = require('express')
const router = express.Router();
const orderModel = require('../db/orderSchema')
const jwt = require('jsonwebtoken')
const jwtSecret = 'sdsfdsfdsfdsf'
const nodemailer=require('nodemailer')
router.post('/confirmorder', (req, res) => {
    let OrderData = new orderModel({ customer_id: req.body.customer_id, product_id: req.body.product_id, delivery_address: req.body.delivery_address, isDelivered: false, total_Productcost: req.body.total_Productcost })
    OrderData.save((err) => {
        if (err) {
            console.log(err);
            res.status(400).json({ err: 1, msg: 'email must be diffenet' })
        }
        else {
            console.log('inside else');
            main(req.body)
            res.status(200).json({ err: 0, msg: 'Order Confirmed' })
        }
    })

})
router.post('/orderdetails', (req, res) => {
    console.log(req.body);
    orderModel.find({ customer_id: req.body.id }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).json({ err: 1, msg: 'email must be diffenet' })
        }
        else {
            res.status(200).json({ err: 0, order: data })
        }
    })

})

async function main(Data) {
    console.log('inside main');
    let transpoter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: "emperorrock50@gmail.com",
            pass: "EmperorRock50"
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let mailOptions = {
        from: 'emperorrock50@gmail.com',
        to: Data.email,
        subject: 'Order Confirm!!!',
        html: `<h2>Order Confirmed</h2><br/>
        <img src="https://www.lucknowmeatwala.com/imgfile/sucess.gif" height="80px" width="80px"/>
    <p>Delivery Address: ${Data.delivery_address.address},${Data.delivery_address.City}-${Data.delivery_address.PinCode},${Data.delivery_address.State},${Data.delivery_address.Country}</p>
    <p>Total Cost:Rs.${Data.total_Productcost}</p>`
    }
    transpoter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            console.log('mail not send');
        }
        else {
            console.log('mail sent!!');
        }
    })
}
module.exports = router