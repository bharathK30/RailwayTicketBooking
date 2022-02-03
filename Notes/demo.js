const moment = require('moment')
const ob = {
    name : "bharath",
    age:20,
    sleeperClass: 200,
    "AC 3 Tier": 40,
    "AC 2 Tier": 26
}
ob.sleeperClass = ob.sleeperClass-1;

console.log(ob.sleeperClass);
console.log(ob);
const date = '2022-02-20 14:25'
console.log(moment(date).toLocaleString());

console.log('ggggg'.match(/Bharath/i));