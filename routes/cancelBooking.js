const Joi = require('joi');
const {Bookings} = require('../models/book');
Joi.objectId = require('joi-objectid')(Joi)
const {MongoClient, ObjectId}= require('mongodb');
const express = require('express');
const auth = require('../middleware/auth');
const normalUser = require('../middleware/normal');
const { Trains } = require('../models/train');
const router = express.Router();

router.post('/',[auth,normalUser],async(req,res)=>{
    // throw new Error("This is because of error in cancel booking api");

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let train = await Bookings.findOneAndDelete({_id : ObjectId(req.body.bookingId)})

    train = train.value
    const className = train.class;
    const ticketsNeeded = train.ticketsNeeded;
    const newTrain = await Trains.findOne({_id: ObjectId(train.trainId)});
    const newSeats = newTrain.seats;
    newSeats[className] = newSeats[className]+ticketsNeeded;
    const result = await Trains.findOneAndUpdate({_id : ObjectId(train.trainId)},{$set:{seats:newSeats}})
    res.send(train)
})

function validate(booking){
    const schema = Joi.object({
        bookingId : Joi.objectId().required()
    })
    return schema.validate(booking)
}

module.exports = router