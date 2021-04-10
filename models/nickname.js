var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var NicknameSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  name: String,
});

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Nickname", NicknameSchema);
