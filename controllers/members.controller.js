const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../models/members.model");

const cors = require("cors");
var corsOptions = {
  origin: process.env.CORS_API_WEB,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

(exports.create = cors(corsOptions)),
  async (req, res) => {
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
      if (user)
        return res.status(409).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.member_password, salt);
      await new Members({
        ...req.body,
        member_password: hashPassword,
      }).save();
      res.status(201).send({ message: "สร้างผู้ใช้งานสำเร็จ", status: true });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };
(exports.findAll = cors(corsOptions)),
  async (req, res) => {
    try {
      Members.find()
        .then(async (data) => {
          res.send({ data, message: "success", status: true });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "มีบางอย่างผิดพลาด",
          });
        });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };
(exports.findOne = cors(corsOptions)),
  (req, res) => {
    const id = req.params.id;
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
  };
(exports.findByPhone = cors(corsOptions)),
  (req, res) => {
    const id = req.params.id;
    console.log(id);
    Members.find({ member_phone_number: id })
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
  };
(exports.update = cors(corsOptions)),
  async (req, res) => {
    console.log(req.body);
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.member_password) {
        Members.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "มีบ่างอย่างผิดพลาด" + id,
              status: false,
            });
          });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.member_password, salt);
        Members.findByIdAndUpdate(
          id,
          { ...req.body, member_password: hashPassword },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };

(exports.delete = cors(corsOptions)),
  (req, res) => {
    const id = req.params.id;
    Members.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบผู้ใช้งานนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบผู้ใช้งานนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
          status: false,
        });
      });
  };
