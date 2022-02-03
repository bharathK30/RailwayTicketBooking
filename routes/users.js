const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Users,validate,generateAuthToken}=require('../models/user');
const express = require('express');
const router =express.Router();
const {MongoClient} = require('mongodb')
// console.log(Users);
router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({email : req.body.email});
    if (user) return res.status(400).send('User already registered with the given email.');

    user = await Users.findOne({phoneNumber : req.body.phoneNumber});
    if (user) return res.status(400).send('User already registered with the given phone number.');

    user = await Users.findOne({aadharNumber:req.body.aadharNumber});
    if (user) return res.status(400).send('User already registered with the given aadhar.');

    user = req.body;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password,salt);
    user.password=password;
    Users.insertOne(user);

    const token = generateAuthToken(user);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router