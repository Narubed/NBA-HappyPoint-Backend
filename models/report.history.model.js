const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const ReportHistorySchema = new mongoose.Schema({
  rph_member_id: { type: String, required: true },
  rph_name: { type: String, required: true },
  rph_amount: { type: Number, required: true, default: 0 },
  rph_point: { type: Number, required: true, default: 0 },
  rph_detail: { type: String, required: true },
  rph_type: { type: String, required: false, default: "รับเข้า" },
  rph_timestamp: { type: Date, required: false, default: Date.now() },
  rph_status: { type: String, required: false, default: "ใช้งานแล้ว" },
  rph_note: { type: String, required: false, default: "ไม่มี" },
});

ReportHistorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const ReportHistory = mongoose.model("report_history", ReportHistorySchema);

const validate = (data) => {
  const schema = Joi.object({
    rph_member_id: Joi.string(),
    rph_name: Joi.string(),
    rph_amount: Joi.number().precision(3).default(0),
    rph_point: Joi.number().precision(3).default(0),
    rph_detail: Joi.string(),
    rph_type: Joi.string().default("รับเข้า"),
    rph_timestamp: Joi.date().raw().default(Date.now()),
    rph_status: Joi.string().default("ใช้งานแล้ว"),
    rph_note: Joi.string().default("ไม่มี"),
  });
  return schema.validate(data);
};

module.exports = { ReportHistory, validate };
