const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config')
const {MongoClient} = require('mongodb');
const {db,connect,createCollection}=require('../startup/db')
const userSchema = {
    bsonType: "object",
    required: ["name", "email", "password","phoneNumber","aadharNumber"],
    properties: {
        "name": {
            bsonType: String,
            description: "must be a string and is required"
        },
        "email": {
            bsonType: String,
            description: "must be a string and is required",
        },
        "password": {
            bsonType: String,
            description: "must be a string"
        },
        "phoneNumber" :{
            bsonType :Number,
            description: "must be a Number"
        },
        "aadharNumber" :{
            bsonType :Number,
            description : "Must be a Number"
        },
        "isAdmin": {
            bsonType: Boolean,
        }

    }
}
async function main(){
    try{
        await connect();
        await createCollection("Users",userSchema)
    }
    catch(ex){
        console.error(ex);
    }
}
main().catch(console.error)
const Users = db.collection('Users',{strict : true})


function generateAuthToken(user) { 
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin,isSuperAdmin : user.isSuperAdmin }, config.get('jwtPrivateKey'),{expiresIn:'45m'});
    return token;
}

function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      phoneNumber:Joi.number().min(1000000000).max(9999999999).required(),
      aadharNumber:Joi.number().min(000000000000).max(999999999999).required(),
      password: Joi.string().min(5).max(10).required(),
      isAdmin:Joi.boolean()
    }) ;
  
    return schema.validate(user);
}
  
exports.Users = Users;
exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;