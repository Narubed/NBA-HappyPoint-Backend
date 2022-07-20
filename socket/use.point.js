const mongoose = require("mongoose");
const UsePoint = mongoose.model("use-point");

module.exports = usePoint = async (req, res) => {
  console.log(req);
  let newUsePoint = [];
  await UsePoint.findById(req.room).then(async (value) => {
    newUsePoint = value;
  });
  const valueReduceUseing = newUsePoint.usep_useing.reduce(
    (value, item) => value + item.member_amount,
    0
  );
  const newValueReduceUseing =
    newUsePoint.usep_limited_total - valueReduceUseing;
  return newValueReduceUseing;
};
