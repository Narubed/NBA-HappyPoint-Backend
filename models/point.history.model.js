const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const PointHistorySchema = new mongoose.Schema({
  ph_member_id: { type: String, required: true },
  ph_title: { type: String, required: true },
  ph_detail: { type: String, required: true },
  ph_point: { type: Number, required: false, default: 0 },
  ph_type: { type: String, required: false, default: "รับเข้า" },
  ph_message_status: { type: Boolean, required: false, default: false },
  ph_timestamp: { type: Date, required: false, default: Date.now() },
});

PointHistorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const PointHistory = mongoose.model("point_history", PointHistorySchema);

const validate = (data) => {
  const schema = Joi.object({
    ph_member_id: Joi.string(),
    ph_title: Joi.string(),
    ph_detail: Joi.string(),
    ph_point: Joi.number().precision(3).default(0),
    ph_type: Joi.string().default("รับเข้า"),
    ph_message_status: Joi.boolean().default(false),
    ph_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { PointHistory, validate };
