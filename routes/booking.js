const {Bookings,validate} = require('../models/book');
const {Users} = require('../models/user');

const {MongoClient, ObjectId}= require('mongodb');
const express = require('express');
const auth = require('../middleware/auth');
const normalUser = require('../middleware/normal');
const { Trains } = require('../models/train');
const router = express.Router();


router.get('/myBookings',[auth,normalUser],async(req,res)=>{
    const cursor =await Bookings.find({userId :req.user._id});
    const result = await cursor.toArray();
    if(!result) return res.status(404).send("No Bookings found");
    res.send(result);
})

router.post('/',[auth,normalUser],async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const train = await Trains.findOne(ObjectId(req.body.trainId));
    if (!train) return res.status(400).send('Invalid Train.');
    let hasClass = false
    
    const user = await Users.findOne(ObjectId(req.user._id));
    if (!user) return res.status(400).send('Invalid user.');
    if(!(req.body.ticketsNeeded === Object.keys(req.body.passengers).length)) return res.status(400).send("Tickets count and passenger details are mismatched...")
    const className = req.body.class
    for (const item in train.seats) {
        if(item === className){
            hasClass = true
        }
      }
    if(!hasClass) return res.status(400).send("Please Enter Correct Classname")
    if (train.seats.className === 0) return res.status(400).send('All seats are booked in this class')

    let booking = {
        trainId : req.body.trainId,
        class : req.body.class,
        ticketsNeeded:req.body.ticketsNeeded,
        passengers : req.body.passengers,
        userId : req.user._id,
    }
    //console.log(className);
    const newTrain = await Trains.findOne({_id: ObjectId(req.body.trainId)});
    // console.log(newSeats.seats);
    const newSeats = newTrain.seats;
    // console.log(newSeats[className]);
    if (newSeats[className] === 0) return res.status(400).send('All seats are booked in this class')
    newSeats[className] = newSeats[className]-req.body.ticketsNeeded;
    if (newSeats[className] < 0) return res.status(400).send(`Only ${newSeats[className]+req.body.ticketsNeeded} seats are left in this class`)
    // console.log(newSeats);
    booking = await Bookings.insertOne(booking);
    const result = await Trains.findOneAndUpdate({_id : ObjectId(req.body.trainId)},{$set:{seats:newSeats}})
    res.send(booking)
})

module.exports = router;