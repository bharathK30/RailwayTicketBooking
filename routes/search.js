const auth = require('../middleware/auth');
const normalUser = require('../middleware/normal')
const {Trains,dateValidation, validate} = require('../models/train');
const {MongoClient} =  require('mongodb');
const express = require('express');
const Joi = require('joi');
const moment = require('moment');
const { isString } = require('lodash');

const router = express.Router();

router.get('/',[auth,normalUser],async(req,res)=>{
    const paramsString = req.url.split('?')[1];
    const eachParamArray = paramsString.split('&');
    let params = {};
    eachParamArray.forEach((param) => {
        const key = param.split('=')[0];
        const value = param.split('=')[1];
        Object.assign(params, {[key]: value});
    });

    if(Object.keys(params).length != 3) return res.status(400).send("There should only 3 parameters in this request");
    
  
    const date= moment(params.date,"DD/MM/YYYY");

    if (!(moment(date).isValid()))
    return res.status(400).send("Enter Correct date")

    var dateStr = date.toString();
    dateStr = new Date(dateStr);
    dateStr = dateStr.toDateString();
    
    const cursor = await Trains.find();
    const trains = await cursor.toArray();
    // console.log(trains);
    if(trains.length == 0) return res.status(404).send("No trains found..");
    let trainArr = [];
    trains.forEach(train =>{
        let dateInDB = new Date(train.startTime);
        let stops = train.stops
       dateInDB = dateInDB.toDateString();
        
        if(stops.includes(params.from) && stops.includes(params.to) && dateInDB === dateStr){
            trainArr.push(train)
        }
    })
    res.send(trainArr)
})

module.exports = router