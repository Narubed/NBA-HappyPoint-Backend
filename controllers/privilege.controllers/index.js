const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Privilege, validate } = require("../../models/privilege.model");
const cors = require("cors");
var corsOptions = {
  origin: process.env.CORS_API_WEB,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

(exports.findAll = cors(corsOptions)),
  async (req, res) => {
    try {
      Privilege.find()
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
    Privilege.findById(id)
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

(exports.delete = cors(corsOptions)),
  (req, res) => {
    const id = req.params.id;
    Privilege.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
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
(exports.update = cors(corsOptions)),
  async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;

      Privilege.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขข้อมูลนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขข้อมูลนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "มีบ่างอย่างผิดพลาด",
            status: false,
          });
        });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };
(exports.create = cors(corsOptions)),
  async (req, res) => {
    try {
      const { error } = validate(req.body);
      if (error)
        return res
          .status(400)
          .send({ message: error.details[0].message, status: false });

      await new Privilege({
        ...req.body,
      }).save();
      res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };
