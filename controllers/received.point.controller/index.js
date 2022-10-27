const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
require("dotenv").config();

exports.findOne = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    Members.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.findByPhone = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    Members.findOne({ member_phone_number: id })
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else {
          const newResponse = {
            phone: data.member_phone_number,
            firstname: data.member_firstname,
            lastname: data.member_lastname,
            point: data.member_current_point,
          };
          console.log(data);
          res.send({ data: newResponse, status: true });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
