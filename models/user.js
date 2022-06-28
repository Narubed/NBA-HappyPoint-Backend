const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  imgCollection: { type: Array },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Users = mongoose.model("users", UserSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    lmb_name: Joi.array(),
  });
  return schema.validate(data);
};

module.exports = { Users, validate };
