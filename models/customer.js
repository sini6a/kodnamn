var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var CustomerSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  name: String,
  contact: String,
  note: String,
});

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema);
