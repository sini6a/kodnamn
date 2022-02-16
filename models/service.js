var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var ServiceSchema = new mongoose.Schema({
  terminal: {type: mongoose.Schema.Types.ObjectId, ref: "Terminal"},
  part: String, // Screen, Box, Other
  note: String,
}, { timestamps: true });

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Service", ServiceSchema);
