var mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, trim: true, unique: true, required: true },
  hash_password: { type: String, required: true },
  address: { type: String, unique: true, required: true },
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
