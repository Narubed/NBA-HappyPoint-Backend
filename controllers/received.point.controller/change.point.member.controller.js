const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");

exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    if (!req.body.phone_number || !req.body.point) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }

    const user = await Members.findOne({
      member_phone_number: req.body.phone_number,
    });

    if (user) {
      const valueCurrent = user.member_current_point + req.body.point;
      const valuetotal = user.member_total_point + req.body.point;
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
              message: "ทำการเพิ่ม Point ใน Happy Point แล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "มีบ่างอย่างผิดพลาด",
            status: false,
          });
        });
    } else {
      return res.status(409).send({
        status: false,
        message: "หาผู้ใช้งานนี้ไม่พบ หรือไม่มีผู้ใช้งานนี้ในระบบ",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
