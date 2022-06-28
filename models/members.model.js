const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 20,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const membersSchema = new mongoose.Schema({
  member_phone_number: { type: String, required: true },
  member_firstname: { type: String, required: true },
  member_lastname: { type: String, required: true },
  member_address: { type: String, required: true },
  member_password: { type: String, required: true },
  member_current_point: { type: Number, required: true, default: 1 },
  member_total_point: { type: Number, required: true, default: 1 },
  member_level: {
    type: String,
    required: true,
    default: "62b0357d47deaced06154de5",
  },
  member_timestamp: { type: Date, required: false, default: Date.now() },
});

membersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Members = mongoose.model("members", membersSchema);

const validate = (data) => {
  const schema = Joi.object({
    member_phone_number: Joi.string().required().label("member_phone_number"),
    member_firstname: Joi.string().required().label("member_firstname"),
    member_lastname: Joi.string().required().label("member_lastname"),
    member_address: Joi.string().required().label("member_address"),
    member_password: passwordComplexity(complexityOptions)
      .required()
      .label("member_password"),
    member_current_point: Joi.number().precision(3).default(1),
    member_total_point: Joi.number().precision(3).default(1),
    member_level: Joi.string().default("62b0357d47deaced06154de5"),
    member_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Members, validate };
