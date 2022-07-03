const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { UsePoint, validate } = require("../../models/use.point.model");

exports.findAll = async (req, res) => {
  try {
    UsePoint.find()
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
exports.findOne = (req, res) => {
  const id = req.params.id;
  UsePoint.findById(id)
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

exports.delete = (req, res) => {
  const id = req.params.id;
  UsePoint.findByIdAndRemove(id, { useFindAndModify: false })
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
exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;

    UsePoint.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        console.log(data);
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
exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    await new UsePoint({
      ...req.body,
    }).save();
    res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
