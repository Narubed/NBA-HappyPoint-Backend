require("dotenv").config();

module.exports = usePoint = async (req, res) => {
  console.log(req.headers.origin);
  if (req.headers.origin || req.headers.origin === "http://localhost:3000") {
    return true;
  } else if (!req.headers.secret_key || !req.headers.token_key) {
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
