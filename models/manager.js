var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var ManagerSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  name: String,
  contact: String,
  note: String,
});

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Manager", ManagerSchema);
