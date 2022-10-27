require("dotenv").config();

module.exports = checkToken = async (req, res, next) => {
  let token = req.headers["auth-token"];
  if (token) {
    token = token.replace(/^Bearer\s+/, "");
    const configToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUwZWU4YTk0NGY4MjZkMDVlMTFkMjEiLCJyb3ciOiJtZW1iZXJzIiwiaWF0IjoxNjY2ODQyMDQxfQ.e0cwUhZIJajQuCqTP4N1lgTfF5t5yqg_t7UTQY0TLi8";
    if (token === configToken) {
      next();
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Token not provided Token ไม่ถูกต้อง",
      logout: false,
      description: "Unauthorized",
    });
  }
};
