const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Bookings} = require('../models/book')
const {Trains,validate} = require('../models/train');
const {MongoClient} = require('mongodb');
const express = require('express');
const moment = require('moment');
const { isNumber} = require('lodash');
const router = express.Router();

router.get('/',[auth,admin],async(req,res)=>{
    const cursor = await Trains.find().sort('trainNumber');
    const trains = await  cursor.toArray();
    res.send(trains);
});

router.post('/',[auth,admin],async(req,res)=>{
    const {error}= validate(req.body);
    //console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    if (!(req.body.from === req.body.stops[0] && req.body.to === req.body.stops[req.body.stops.length - 1])) return res.status(400).send("Enter Correct Stops..");

    // if(!(dateValidation(req.body.date))) return res.status(400).send("Enter Correct date and it should be in the format of [dd,mm,yyyy]");
    // if(!(timeValidation(req.body.startTime))) return res.status(400).send("Enter Correct date and time.. and it should be in the format of [day,dd,mm,yyyy,hh,mm]");
    // if(!(timeValidation(req.body.endTime))) return res.status(400).send("Enter Correct date and time.. and it should be in the format of [day,dd,mm,yyyy,hh,mm]");
    // // console.log(dateValidation(req.body.date));
    //console.log(timeValidation(req.body.startTime));
    // console.log(timeValidation(req.body.endTime));
    // // timeValidation(req.body.endTime);
    const start= moment(req.body.startTime,"DD/MM/YYYY hh:mm:ss");
    const end = moment(req.body.endTime,"DD/MM/YYYY hh:mm:ss");
 
    // const newsd= new Date(startTime.toString());
    // const newed = new Date(endTime.toString());
    // console.log(newsd.toDateString() === newed.toDateString());
    // console.log(start);
    // console.log(end);
    // console.log(moment(startTime).toString());
    // console.log(moment(endTime).toLocaleString());
    if (!(moment(start).isValid()) || !(moment(end).isValid()))
    return res.status(400).send("Enter Correct date")

    let train = await Trains.findOne({trainNumber: req.body.trainNumber,startTime : start.toString()});
    if (train) return res.status(400).send('Train already registered on the given date..');
    const val = start.isBefore(end);
    if(! val) return res.status(400).send("Enter Correct Start Time and End Time")
    const seats = req.body.seats;
    for (let className in seats){
        // console.log(seats[className]);
        if(seats[className]<5) {

            return res.status(400).send("Create a Train if there is more than 5 seats in all classes...")
        }
    }
    //console.log(moment(endTime).toArray());
    try{
        train = {
            trainName: req.body.trainName,
            trainNumber : req.body.trainNumber,
            from : req.body.from,
            to: req.body.to,
            startTime:start.toString(),
            endTime : end.toString(),
            stops:req.body.stops,
            seats:req.body.seats
        }
    }
    catch(ex){
        console.error(ex)
    }
    train = await Trains.insertOne(train);
    res.send(train);
});

router.put('/:num',[auth,admin],async(req,res)=>{
    const num = req.params.num
    if(isNaN(Number(num))) return res.status(400).send("The parameter should be a number..");
    
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    if (!(req.body.from === req.body.stops[0] && req.body.to === req.body.stops[req.body.stops.length - 1])) return res.status(400).send("Enter Correct Stops..");

    if(!(Number(req.params.num) === req.body.trainNumber)) return res.status(400).send("Train number mismatch..");

    let train =await Trains.findOne({trainNumber:Number(req.params.num)})
    const id = train._id.toString();
    const booking = await Bookings.findOne({trainId : id})
    // console.log(booking);
    if(booking) return res.status(400).send("There are some bookings in this train you can't modify the train now....")
    const start= moment(req.body.startTime,"DD/MM/YYYY hh:mm:ss");
    const end = moment(req.body.endTime,"DD/MM/YYYY hh:mm:ss");

    if (!(moment(start).isValid()) || !(moment(end).isValid()))
    return res.status(400).send("Enter Correct date");

    // moment('2010-10-20').isSameOrAfter('2010-10-19');
    train  = await Trains.findOneAndUpdate({trainNumber:Number(req.params.num)},{$set:{
        trainName: req.body.trainName,
        from : req.body.from,
        to: req.body.to,
        startTime:start.toString(),
        endTime : end.toString(),
        stops:req.body.stops,
        seats:req.body.seats}},{returnDocument:'after'});
    res.send(train.value);

});

router.delete('/:num',[auth,admin],async(req,res)=>{
    const num = req.params.num
    if(isNaN(Number(num))) return res.status(400).send("The parameter should be a number..");

    const train = await Trains.findOneAndDelete({trainNumber : Number(req.params.num)});
    if (!train) return res.status(404).send('The train with the given number was not found.');

    res.send(train.value);
});

router.get('/:num',[auth],async(req,res)=>{
    const num = req.params.num
    if(isNaN(Number(num))) return res.status(400).send("The parameter should be a number..");
    // console.log(req.params.num);
    //console.log(isNumber(num));
    const train = await Trains.findOne({trainNumber:Number(num)});
    // console.log(train);
    if (!train) return res.status(404).send('The train with the given number was not found.');
    res.send(train)
})

module.exports = router;