require('express-async-errors');
const winston = require('winston');

module.exports = function(){
    winston.exceptions.handle(
        // new winston.transports.Console({format: winston.format.colorize()}),
        new winston.transports.File({ filename: 'UncaughtExceptions.log' })//Other method for handling the uncaught exceptions
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    })
}