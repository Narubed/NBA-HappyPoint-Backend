require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");
const members = require("./routes/members");
const login_members = require("./routes/login_members");
const privilege = require("./routes/privilege");
const test = require("./routes/test");
const uploadImage = require("./routes/uploadImage");
const deleteImage = require("./routes/deleteImage");
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/happy-point/uploadImage", uploadImage);
app.use("/api/happy-point/members", members);
app.use("/api/happy-point/login_members", login_members);
app.use("/api/happy-point/test", test);
app.use("/api/happy-point/privilege", privilege);
app.use("/api/happy-point/deleteImage", deleteImage);

const port = process.env.PORT || 9000;
app.listen(port, console.log(`Listening on port ${port}...`));
