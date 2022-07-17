require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

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
const reportHistory = require("./routes/report.history");
const receivedPoint = require("./routes/received.point");
const usePoint = require("./routes/use.point");
connection();

// middlewares
app.use(express.json());
app.use(cors());

// socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });
});

// routes
app.use("/api/happy-point/uploadImage", uploadImage);
app.use("/api/happy-point/members", members);
app.use("/api/happy-point/login_members", login_members);
app.use("/api/happy-point/test", test);
app.use("/api/happy-point/privilege", privilege);
app.use("/api/happy-point/deleteImage", deleteImage);
app.use("/api/happy-point/report_history", reportHistory);
app.use("/api/happy-point/recived_point/", receivedPoint);
app.use("/api/happy-point/use_point/", usePoint);

const port = process.env.PORT || 9000;
server.listen(port, console.log(`Listening on port ${port}...`));
