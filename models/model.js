const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
  name:String,
  last:String,
  buy:String,
  sell:String,
  volume:String,
  base_unit:String
})

Doc = mongoose.model('Doc',schema);

module.exports = Doc;
