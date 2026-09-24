import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "mongoose-unique-validator";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    admin: { type: Boolean, required: true },
  },
  { timestamps: true },
);

schema.methods.passwordCheck = function passwordCheck(password) {
  return bcrypt.compareSync(password, this.passwordHash, function (err, hash) {
    if (err) throw err;
  });
};

schema.methods.genToken = function genToken() {
  return jwt.sign(
    {
      email: this.email,
      username: this.username,
      admin: this.admin,
    },
    process.env.JWT_SECRET,
  );
};

schema.methods.toAuthJson = function toAuthJson() {
  return {
    email: this.email,
    username: this.username,
    admin: this.admin,
    token: this.genToken(),
  };
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10, function (err, hash) {
    if (err) throw err;
  });
};

schema.plugin(validator, { message: "duplicate" });
export default mongoose.model("user", schema);
