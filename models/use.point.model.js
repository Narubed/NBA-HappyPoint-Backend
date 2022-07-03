const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const UsePointSchema = new mongoose.Schema({
  usep_name: { type: String, required: true },
  usep_point: { type: Number, required: true },
  usep_grop_level: { type: Array, required: true },
  usep_limited_total: { type: Number, required: false, default: 1 },
  usep_limited_member: { type: Number, required: false, default: 1 },
  usep_date_start: { type: Date, required: false, default: Date.now() },
  usep_date_end: { type: Date, required: false, default: Date.now() },
  usep_image: { type: Array, default: [] },
  usep_useing: { type: Array, default: [] },
  usep_detail: { type: String, required: true },
  usep_status: { type: Boolean, default: true },
  usep_note: { type: String, required: false, default: "ไม่มี" },
});

UsePointSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const UsePoint = mongoose.model("use-point", UsePointSchema);

const validate = (data) => {
  const schema = Joi.object({
    usep_name: Joi.string().required().label("usep_name"),
    usep_point: Joi.number(),
    usep_grop_level: Joi.array(),
    usep_limited_total: Joi.number().precision(3).default(1),
    usep_limited_member: Joi.number().precision(3).default(1),
    usep_date_start: Joi.date().raw().default(Date.now()),
    usep_date_end: Joi.date().raw().default(Date.now()),
    usep_image: Joi.array(),
    usep_useing: Joi.array(),
    usep_detail: Joi.string().required().label("usep_detail"),
    usep_status: Joi.boolean().default(true),
    usep_note: Joi.string().default("ไม่มี"),
  });
  return schema.validate(data);
};

module.exports = { UsePoint, validate };
