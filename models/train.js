const { date } = require('joi');
const Joi = require('joi');
const {MongoClient} = require('mongodb');
const {db,connect,createCollection} =require('../startup/db');

const trainSchema = {
    bsonType: "object",
    required: ["trainNumber", "trainName", "from","to","startTime","endTime","stops","seats"],
    properties: {
        "trainNumber":{
            bsonType : Number,
            description: "must be a Number and is required"
        },
        "trainName": {
            bsonType: String,
            description: "must be a string and is required"
        },
        "from": {
            bsonType: String,
            description: "must be a string and is required",
        },
        "to": {
            bsonType: String,
            description: "must be a string and is required",
        },
        "startTime": {
            bsonType: String,
            description: "must be a Date and is required",
        },
        "endTime": {
            bsonType: String,
            description: "must be a Date and is required",
        },
        "stops": {
            bsonType: Array,
            description: "must be an Array and it is required"
        },
        "seats": {
            bsonType: Object,
            description: "must be an Object and it is required"
        }
    }
}
async function main(){
    try{
        await connect();
        await createCollection("Trains",trainSchema);
    }
    catch(ex){
        console.error(ex);
    }
}
main().catch(console.error)

const Trains = db.collection('Trains',{strict : true});

function validateTrains (train){
    const schema = Joi.object({
        trainNumber:Joi.number().min(00000).max(99999).required(),
        trainName:Joi.string().min(5).max(50).required(),
        from:Joi.string().min(3).max(50).required(),
        to:Joi.string().min(3).max(50).required(),
        stops:Joi.array().required(),
        seats:Joi.object().min(1).required(),
        startTime:Joi.string().required(),
        endTime:Joi.string().required()
    });
    return schema.validate(train);
}
module.exports.Trains = Trains;
module.exports.validate =validateTrains;

