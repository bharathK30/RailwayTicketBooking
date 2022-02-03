const {MongoClient} = require('mongodb');
const winston = require('winston')
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db("RailwayTicketBooking");

async function connect(){
    try{
        await client.connect();
        winston.info(`Connected to ${db.databaseName} database`);
    }
    catch(ex){
        console.error(ex);
    }
}

async function dbCreationAndValidation(collectionName,schema){
    try{
        const result = await db.command({ listCollections: 1 });
        const collectionsList = result.cursor.firstBatch;
        var collectionExist = false;
        collectionsList.forEach(collection => 
            {
            if(collection.name===collectionName)
            {
            collectionExist = true;
            }
         }
         );
        if (!collectionExist) {
            console.log("");
            const User = await db.createCollection(collectionName, {
                validator: {
                    $jsonSchema:schema
                }
            })
            // console.log(`In the created collection named - ${collectionName}`);
        }
        else{
            // console.log(`In the  collection named - ${collectionName}`);
        }
    }
    catch(ex){
        console.error(ex)
    }

}

module.exports.db =db;
module.exports.connect = connect;
module.exports.createCollection = dbCreationAndValidation;