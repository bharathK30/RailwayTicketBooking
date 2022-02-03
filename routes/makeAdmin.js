const express = require('express');
const superAdmin = require('../middleware/superAdmin');
const auth = require('../middleware/auth')
const {Users} = require('../models/user')
const router = express.Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const {MongoClient, ObjectId} = require('mongodb')

router.post('/',[auth,superAdmin],async(req,res)=>{
    const {error}= validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const adminUser = await Users.findOneAndUpdate({_id : ObjectId(req.body.userId)},{$set:{isAdmin:true}},{upsert:true,returnDocument:'after'});
    
    res.send(adminUser)
})

function validate(userId){
    const schema = Joi.object({
        userId : Joi.objectId().required()
    })
    return schema.validate(userId);
}
module.exports = router