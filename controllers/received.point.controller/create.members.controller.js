const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    const user = await Members.findOne({
      member_phone_number: req.body.member_phone_number,
    });
    if (user) {
      const valueCurrent =
        user.member_current_point + req.body.member_current_point;
      const valuetotal = user.member_total_point + req.body.member_total_point;
      await Members.findByIdAndUpdate(
        user._id,
        { member_current_point: valueCurrent, member_total_point: valuetotal },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `มีชื่อผู้ใช้งานนี้ในระบบเเล้ว ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.status(201).send({
              message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว ทำการเพิ่ม Point แทน",
              status: false,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "มีบ่างอย่างผิดพลาด",
            status: false,
          });
        });
      // return res.status(409).send({
      //   status: true,
      //   message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว ทำการเเก้ไข Point แทน",
      // });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.member_password, salt);
      await new Members({
        ...req.body,
        member_password: hashPassword,
      }).save();
      res.status(201).send({ message: "สร้างผู้ใช้งานสำเร็จ", status: true });
    }
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
