var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var TerminalSchema = new mongoose.Schema({
  codename: {type: mongoose.Schema.Types.ObjectId, ref: "Codename"},
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  macAddress: String,
  nickname: {type: mongoose.Schema.Types.ObjectId, ref: "Nickname"},
  motherboard: String,
  processor: String,
  graphics: String,
  ram: Number,
  teamviewer: String
}, { timestamps: true });

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Terminal", TerminalSchema);
