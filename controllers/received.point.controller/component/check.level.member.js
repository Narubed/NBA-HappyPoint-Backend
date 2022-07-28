const mongoose = require("mongoose");
const { LevelMembers } = require("../../../models/level.member.model");

const cors = require("cors");
var corsOptions = {
  origin: process.env.CORS_API_WEB,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

(module.exports = checkLevelMember = cors(corsOptions)),
  async (req, res) => {
    console.log(req.member_level);
    let value = 1;
    await LevelMembers.findById(req.member_level).then((data) => {
      value = data.lmb_multiply / 100;
    });

    return value;
  };
