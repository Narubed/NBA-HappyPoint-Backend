const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { ReportHistory, validate } = require("../models/report.history.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    console.log(error);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    await new ReportHistory({
      ...req.body,
    }).save();
    res.status(201).send({ message: "สร้างรายงานสำเร็จ", status: true });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.findAll = async (req, res) => {
  try {
    ReportHistory.find()
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
  ReportHistory.findById(id)
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
exports.findMyMember = (req, res) => {
  const id = req.params.id;
  ReportHistory.find({ rph_member_id: id })
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

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;

    ReportHistory.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
          message: "มีบ่างอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ReportHistory.findByIdAndRemove(id, { useFindAndModify: false })
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
