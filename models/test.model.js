const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const TestSchema = new mongoose.Schema({
  test_name: { type: String, required: true },
  test_phones: { type: Array, default: [] },
  test_news: [{ one: String, two: String, tree: String }],
  test_add: { type: String, required: true },
});

TestSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Test = mongoose.model("test", TestSchema);

const validate = (data) => {
  const schema = Joi.object({
    test_name: Joi.string().required().label("ชื่อเลเวล"),
    test_phones: Joi.array(),
    test_news: Joi.object(),
  });
  return schema.validate(data);
};

module.exports = { Test, validate };
