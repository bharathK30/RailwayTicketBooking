const winston = require('winston')
const express = require('express');
const users = require('./routes/users');
const login = require('./routes/login');
const trains = require('./routes/trains');
const search = require('./routes/search');
const bookings = require('./routes/booking');
const makeAdmin = require('./routes/makeAdmin');
const error = require('./middleware/error');
const cancelBooking = require('./routes/cancelBooking');
const { info } = require('winston');

const app = express();

app.use(express.json());
app.use('/api/users/', users);
app.use('/api/login', login);
app.use('/api/trains', trains);
app.use('/api/search', search);
app.use('/api/bookTickets', bookings);
app.use('/api/makeAdmin', makeAdmin);
app.use('/api/cancelBooking',cancelBooking);

app.use(error)


require('./startup/logging')();
require('./startup/config')();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

