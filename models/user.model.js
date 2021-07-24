import { Schema as _Schema } from "mongoose";

const Schema = _Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
