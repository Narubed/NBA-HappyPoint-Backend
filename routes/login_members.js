const router = require("express").Router();
const { Members } = require("../models/members.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const CheckHeader = require("../check.header/nbadigitalservice");
require("dotenv").config();
// partner_username
// emp_password

router.post("/", async (req, res) => {
  console.log(req.headers);
  try {
    await CheckHeader(req, res);
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const member = await Members.findOne({
      member_phone_number: req.body.member_phone_number,
    });
    console.log(member);

    if (!member)
      return res.status(401).send({
        message: "เบอร์โทรศัพท์หรือรหัสผ่านผิด",
        status: false,
      });

    const validPassword = await bcrypt.compare(
      req.body.member_password,
      member.member_password
    );
    if (!validPassword)
      return res.status(401).send({
        message: "เบอร์โทรศัพท์หรือรหัสผ่านผิด",
        status: false,
      });

    const token = member.generateAuthToken();
    // const data = {
    //   _id: member._id,
    //   partner_name: member.partner_name,
    //   partner_level: member.partner_level,
    //   partner_sublevel: member.partner_sublevel,
    //   partner_status: member.partner_status,
    // };
    console.log(member);
    const NewValue = {
      _id: member._id,
      member_firstname: member.member_firstname,
      member_lastname: member.member_lastname,
    };
    console.log("seuccess Login");
    res.status(200).send({
      token: token,
      message: "logged in successfully",
      status: true,
      data: NewValue,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    member_phone_number: Joi.string().required().label("member_phone_number"),
    member_password: Joi.string().required().label("member_password"),
  });
  return schema.validate(data);
};

module.exports = router;
