require("dotenv").config();
module.exports = usePoint = async (req, res) => {
  console.log(req.headers);
  // console.log("ip =>", req.headers.x - real - ip);
  if (req.headers.origin) {
    const web = [
      "http://localhost:3000",
      "https://nbadigitalservice.com",
      "https://happy-point.nbadigitalservice.com",
      "https://nba-platform.nbadigitalservice.com",
      "https://e-branch2.nbadigitalworlds.com",
      "https://nba-platform-web.web.app",
      "https://e-service.nbadigitalservice.com",
      "https://nba-eservice.web.app",
    ];
    const findData = web.find((item) => item === req.headers.origin);
    console.log("Name web =>", findData.length);
    console.log();
    if (findData.length !== 0) {
      console.log("can use it");
      return true;
    } else {
      console.log("Not't find Data");
      return error;
    }
    // } else if (req.headers.x - real - ip === "203.159.92.65") {
    //   console.log("Port 203.159.92.65");
    //   return true;
  } else if (!req.headers.secret_key || !req.headers.token_key) {
    console.log("not key");
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
