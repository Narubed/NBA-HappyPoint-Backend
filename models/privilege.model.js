const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const PrivilegeSchema = new mongoose.Schema({
  pvl_name: { type: String, required: true },
  pvl_point: { type: Number, required: true },
  pvl_code: { type: String, required: true },
  pvl_grop_level: { type: Array, required: true },
  pvl_limited_total: { type: Number, required: false, default: 1 },
  pvl_limited_member: { type: Number, required: false, default: 1 },
  pvl_date_start: { type: Date, required: false, default: Date.now() },
  pvl_date_end: { type: Date, required: false, default: Date.now() },
  pvl_image: { type: Array, default: [] },
  pvl_detail: { type: String, required: true },
  pvl_status: { type: Boolean, default: true },
});

PrivilegeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Privilege = mongoose.model("privilege", PrivilegeSchema);

const validate = (data) => {
  const schema = Joi.object({
    pvl_name: Joi.string().required().label("pvl_name"),
    pvl_point: Joi.number(),
    pvl_code: Joi.string().required().label("pvl_code"),
    pvl_grop_level: Joi.array(),
    pvl_limited_total: Joi.number().precision(3).default(1),
    pvl_limited_member: Joi.number().precision(3).default(1),
    pvl_date_start: Joi.date().raw().default(Date.now()),
    pvl_date_end: Joi.date().raw().default(Date.now()),
    pvl_image: Joi.array(),
    pvl_detail: Joi.string().required().label("pvl_detail"),
    pvl_status: Joi.boolean().default(true),
  });
  return schema.validate(data);
};

module.exports = { Privilege, validate };
