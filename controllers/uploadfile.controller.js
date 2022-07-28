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
const { Users } = require("../models/user");

const cors = require("cors");
var corsOptions = {
  origin: process.env.CORS_API_WEB,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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

(exports.create = cors(corsOptions)),
  async (req, res) => {
    let upload = multer({ storage: storage }).array("imgCollection", 6);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const url = req.protocol + "://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        await uploadFileCreate(req.files, res, { i, reqFiles });
        console.log(res.data);
        // reqFiles.push(url + "/public/" + req.files[i].filename);
      }
      try {
        console.log(reqFiles);
        await new Users({
          ...req.body,
          imgCollection: reqFiles,
        }).save();
        res.status(201).send({ message: "สร้างผู้ใช้งานสำเร็จ", status: true });
      } catch (error) {
        res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
      }
      // const user = new User({
      //   _id: new mongoose.Types.ObjectId(),
      //   imgCollection: reqFiles,
      // });
      // user.save().then((result) => {
      //   res.status(201).json({
      //     message: "Done upload!",
      //     userCreated: {
      //       _id: result._id,
      //       imgCollection: result.imgCollection,
      //     },
      //   });
      // });
      //   .catch((err) => {
      //     console.log(err),
      //       res.status(500).json({
      //         error: err,
      //       });
      //   });
    });
  };

async function uploadFileCreate(req, res, { i, reqFiles }) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: ["1oZaopo0gfiVEYGxq2HWCcl2xKg4fP0Pe"],
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
    reqFiles.push(response.data.id);
    console.log(response.data.id);
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });
    // await new Representative({
    //   ...req.body,
    //   representative_image: response.data.id,
    // }).save();
    // res.status(201).send({ message: "Representative created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

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
