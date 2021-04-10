var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// const mongoosePaginate = require('mongoose-paginate');

var UserSchema = new mongoose.Schema({
     username: String,
     password: String,
     email: String,
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);
// UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
