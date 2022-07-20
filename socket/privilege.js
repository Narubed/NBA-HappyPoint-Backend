const mongoose = require("mongoose");
const Privilege = mongoose.model("privilege");

module.exports = usePoint = async (req, res) => {
  let newPrivilege = [];
  await Privilege.findById(req.room).then(async (data) => {
    newPrivilege = data;
  });
  const valueReduceUseing = newPrivilege.pvl_useing.reduce(
    (value, item) => value + item.member_amount,
    0
  );
  const newValueReduceUseing =
    newPrivilege.pvl_limited_total - valueReduceUseing;
  return newValueReduceUseing;
};
