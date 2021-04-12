var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var ManagerSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  name: String,
  contact: String,
  note: String,
});

// delete every codename with manager
ManagerSchema.pre('remove', async function(next) {
  // Remove all codenames that reference the removed manager.
  console.log('removing...');
  await Codename.deleteMany({ manager: this.id }, next);
});
// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Manager", ManagerSchema);
