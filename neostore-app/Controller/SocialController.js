
const jwt = require('jsonwebtoken')
const jwtSecret = 'sdsfdsfdsfdsf'
const userSchema = require('../db/userSchema')

const USER_SOCIAL_LOGIN = async (req, res) => {
    await userSchema.find({ email: req.body.email }, (err, data) => {
        if (err) {
            console.log('inside error');
            res.status(400).json({ err: 1, msg: 'Unable to login' })
        }
        else if (!data[0]) {
            console.log('inside reg');
            let userData = new userSchema({ firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, soical: true })
            userData.save((err) => {
                if (err) {
                    console.log('inside email must be diffenet');
                    res.status(400).json({ err: 1, msg: 'email must be diffenet' })
                }
                else {
                    console.log('inside email must be else');
                    userSchema.find({ email: req.body.email }, (err, data) => {
                        if (!data[0]) {
                            console.log('inside email not found');
                            res.status(400).json({ err: 1, "msg": "Email  is not correct" })
                        }
                        else {
                            console.log('inside reg token');
                            let payload = { uid: data }
                            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                            res.status(200).json({ "err": 0, "msg": `${req.body.firstName} ${req.body.lastName}Login Success`, "token": token })
                        }


                    })
                }
            })
        }
        else if (data[0].soical == true) {
            console.log('inside login');
            let payload = { uid: data }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
            res.status(200).json({ "err": 0, "msg": "Login Success", "token": token })
        }
        else {
            res.json({ err: 1, "msg": "Try to Login with password" })
        }
    })
}
const PROFILE_UPDATE = async (req, res) => {
    await userSchema.updateMany({ email: req.body.email }, { $set: { firstname: req.body.firstname, lastname: req.body.lastname, mobileno: req.body.mobileno } }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).json({ err: 1, msg: 'Unable to Update profile' })
        }
        else {
            console.log('inside else');
            userSchema.find({ email: req.body.email }, (err, data) => {
                if (!data[0]) {
                    console.log('inside email not found');
                    res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
                }
                else {
                    console.log('inside reg token');
                    let payload = { uid: data }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                    res.status(200).json({ "err": 0, "msg": "Profile updated successfully", "token": token })
                }


            })
        }
    })
}
const UPDATE_PROFILE_PIC = async (req, res) => {
    await userSchema.updateOne({ email: req.body.email }, { $set: { profilepic: req.file.filename } }, (err) => {
        if (err) {
            res.status(400).json({ err: 1, 'msg': "unable to change profile pic" })
        }
        else {
            userSchema.find({ email: req.body.email }, (err, data) => {
                if (!data[0]) {
                    console.log('inside email not found');
                    res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
                }
                else {
                    let payload = { uid: data }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                    res.status(200).json({ "err": 0, "msg": "Profile Picture updated successfully", "token": token })
                }


            })
        }
    })
}
const ADD_ADDRESS = async (req, res) => {
    await userSchema.find({ email: req.body.email }, (err, data) => {
        if (err) {
            res.status(400).json({ err: 1, 'msg': "unable add  address" })
        }
        else {
            let addressData = { Address_id: Math.random(), address: req.body.ADDRESS.address, PinCode: req.body.ADDRESS.PinCode, City: req.body.ADDRESS.City, State: req.body.ADDRESS.State, Country: req.body.ADDRESS.Country }
            data[0].Address.push(addressData)
            console.log(data);
            userSchema.updateOne({ email: req.body.email }, { $set: { Address: data[0].Address } }, (err) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ err: 1, 'msg': "unable to change profile pic" })
                }
                else {
                    userSchema.find({ email: req.body.email }, (err, data) => {
                        if (!data[0]) {
                            console.log('inside email not found');
                            res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
                        }
                        else {
                            let payload = { uid: data }
                            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                            res.status(200).json({ "err": 0, "msg": "Address Added", "token": token })
                        }
                    })
                }
            })
        }
    })

}
module.exports = { USER_SOCIAL_LOGIN, PROFILE_UPDATE, UPDATE_PROFILE_PIC, ADD_ADDRESS }