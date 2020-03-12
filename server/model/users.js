let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let UsersSchema = new Schema({
  username:String,
  password:String
});
module.exports = mongoose.model("Users",UsersSchema,"ioc_users");
