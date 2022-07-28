require("dotenv").config();
module.exports = usePoint = async (req, res) => {
  console.log(req.headers);
  if (!req.headers.secret_key || !req.headers.token_key) {
    return error;
  } else if (
    req.headers.secret_key !== process.env.SECRET_KEY ||
    req.headers.token_key !== process.env.TOKEN_KEY
  ) {
    return error;
  } else {
    return true;
  }
};
