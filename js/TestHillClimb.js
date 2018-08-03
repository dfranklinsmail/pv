const Model = require('./PVModel.js');
const HillClimb = require('./HillClimb.js');
var hc = new HillClimb(new Model());
console.log(hc);
hc.climb();

