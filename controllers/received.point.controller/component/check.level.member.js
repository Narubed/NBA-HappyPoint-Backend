const mongoose = require("mongoose");
const { LevelMembers } = require("../../../models/level.member.model");

module.exports = checkLevelMember = async (req, res) => {
  console.log(req.member_level);
  let value = 1;
  await LevelMembers.findById(req.member_level).then((data) => {
    value = data.lmb_multiply / 100;
  });

  return value;
};
