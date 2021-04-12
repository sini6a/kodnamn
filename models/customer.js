var mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var CustomerSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  name: String,
  contact: String,
  note: String,
});

// delete every codename with customer
CustomerSchema.pre('remove', async function(next) {
  // Remove all codenames that reference the removed customer.
  console.log('removing...');
  await Codename.deleteMany({ customer: this.id }, next);
});

// ChannelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema);
