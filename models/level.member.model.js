const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const LevelMembersSchema = new mongoose.Schema({
  lmb_name: { type: String, required: true },
  lmb_point: { type: Number, required: true },
  lmb_multiply: { type: Number, required: true },
});

LevelMembersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const LevelMembers = mongoose.model("level_members", LevelMembersSchema);

const validate = (data) => {
  const schema = Joi.object({
    lmb_name: Joi.string().required().label("ชื่อเลเวล"),
    lmb_point: Joi.number().precision(2).required().label("จำนวน Point"),
    lmb_multiply: Joi.number().precision(3),
  });
  return schema.validate(data);
};

module.exports = { LevelMembers, validate };
