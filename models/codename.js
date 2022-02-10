var mongoose = require("mongoose");
var Terminal = require("../models/terminal");
// const mongoosePaginate = require('mongoose-paginate');

var CodenameSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  manager: {type: mongoose.Schema.Types.ObjectId, ref: "Manager", default : null},
  customer: {type: mongoose.Schema.Types.ObjectId, ref: "Customer", default : null},
  name: String,
  location: String,
  address: String,
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

// ChannelSchema.plugin(mongoosePaginate);

// delete every terminal in codename
// CodenameSchema.pre('remove', async function(next) {
//   // Remove all terminals that reference the removed codename.
//   console.log('removing...');
//   await Terminal.update({ codename: this.id }, {"$set":{"codename": null}}, {"multi": true}, next);
// });

// CodenameSchema.pre('findOneAndUpdate', async function(next) {
//   // Remove all terminals that reference the removed codename.
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log(this.getQuery()); // The document that `findOneAndUpdate()` will modify
//   if(this.deleted == true) {
//     console.log('removing...');
//     await Terminal.update({ codename: this.id }, {"$set":{"codename": null}}, {"multi": true}, next);
//   }
// });

CodenameSchema.post('save', async function(doc, next) {
  if(doc.deleted == true) {
    console.log('removing...');
    await Terminal.update({ codename: doc.id }, {"$set":{"codename": null}}, {"multi": true}, next);
  }
})

Codename = mongoose.model("Codename", CodenameSchema);

module.exports = Codename
