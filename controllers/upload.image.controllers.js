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
    // console.log(file.originalname);
  },
});

exports.create = async (req, res) => {
  console.log("เพะิ่มรูปภาพใหม่ 1 รูป");
  try {
    let upload = multer({ storage: storage }).single("imgCollection");
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      console.log(req.file);
      uploadFileCreate(req, res);
    });

    async function uploadFileCreate(req, res) {
      const filePath = req.file.path;
      console.log(filePath);
      let fileMetaData = {
        name: req.file.originalname,
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
        generatePublicUrl(response.data.id);
        console.log(response.data.id);
        res
          .status(201)
          .send({
            message: "Representative created successfully",
            image: response.data.id,
          });
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  } catch (error) {
    console.log(error.massage);
  }
};

async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
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
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
