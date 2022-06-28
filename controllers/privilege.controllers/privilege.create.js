const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
let express = require("express"),
  mongoose = require("mongoose"),
  router = express.Router();
const { Privilege } = require("../../models/privilege.model");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.create = async (req, res) => {
  let upload = multer({ storage: storage }).array("pvl_image", 20);
  upload(req, res, async function (err) {
    const reqFiles = [];
    for (var i = 0; i < req.files.length; i++) {
      await uploadFileCreate(req.files, res, { i, reqFiles });
    }
    try {
      console.log(reqFiles);
      await new Privilege({
        ...req.body,
        pvl_image: reqFiles,
      }).save();
      res.status(201).send({ message: "สร้างผู้ใช้งานสำเร็จ", status: true });
    } catch (error) {
      res
        .status(500)
        .send({ message: "มีบางอย่างผิดพลาด", status: false, error });
    }
  });
};

async function uploadFileCreate(req, res, { i, reqFiles }) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: ["13ZsmtkF7WVuj3fjJKzRCWVgEX6DDoN6u"],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });

    reqFiles.push(response.data.id);
    generatePublicUrl(response.data.id);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function generatePublicUrl(res) {
  // console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
  } catch (error) {
    console.log(error.message);
  }
}
