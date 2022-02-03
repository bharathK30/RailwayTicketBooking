const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const {MongoClient, ObjectId} = require('mongodb');
const {db,connect,createCollection} = require('../startup/db');

const bookingSchema = {
    bsonType: "object",
    required : ["trainId","class","ticketsNeeded","passengers","userId"],
    properties :{
        "trainId" :{ 
            bsonType:ObjectId,
            description : "Must be the object id of the train"
        },
        "class" :{
            bsonType: String,
            description: "must be a string and is required"
        },
        "ticketsNeeded":{
            bsonType :Number,
            description: "must be a Number and is required"
        },
        "passengers":{
            bsonType : Object,
            description: "must be an Object and it is required"
        },
        "userId": {
            bsonType : ObjectId,
            description:"Must be the object id of the train"
        }
    }
}
async function main(){
    try{
        await connect();
        await createCollection("Bookings",bookingSchema);
    }
    catch(ex){
        console.error(ex);
    }
}
main().catch(console.error)

const Bookings = db.collection('Bookings',{strict : true});

function validateBookings(booking){
    const schema = Joi.object({
        trainId : Joi.objectId().required(),
        class :  Joi.string().min(3).max(20).required(),
        ticketsNeeded : Joi.number().min(1).max(15).required(),
        passengers : Joi.object().required(),
    })
    return schema.validate(booking);
}

module.exports.Bookings = Bookings;
module.exports.validate = validateBookings;