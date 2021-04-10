var mongoose = require("mongoose");
var Terminal = require("../models/terminal");
// const mongoosePaginate = require('mongoose-paginate');

var CodenameSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  manager: mongoose.ObjectId,
  customer: mongoose.ObjectId,
  name: String,
  location: String,
  address: String,
}, { timestamps: true });

// ChannelSchema.plugin(mongoosePaginate);

// delete every terminal in codename
CodenameSchema.pre('remove', async function(next) {
  // Remove all terminals that reference the removed codename.
  console.log('removing...');
  await Terminal.deleteMany({ codename: this.id }, next);
});

Codename = mongoose.model("Codename", CodenameSchema);

module.exports = Codename
