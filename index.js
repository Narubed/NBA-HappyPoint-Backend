require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const connection = require("./config/db");
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/happy-point/uploadImage", require("./routes/uploadImage"));
app.use("/api/happy-point/members", require("./routes/members"));
app.use("/api/happy-point/login_members", require("./routes/login_members"));
app.use("/api/happy-point/test", require("./routes/test"));
app.use("/api/happy-point/privilege", require("./routes/privilege"));
app.use("/api/happy-point/deleteImage", require("./routes/deleteImage"));
app.use("/api/happy-point/report_history", require("./routes/report.history"));
app.use("/api/happy-point/recived_point/", require("./routes/received.point"));
app.use("/api/happy-point/use_point/", require("./routes/use.point"));

const port = process.env.PORT || 9000;
const server = app.listen(port, console.log(`Listening on port ${port}...`));
// server.listen(port, console.log(`Listening on port ${port}...`));

const UsePoint = mongoose.model("use-point");
const Privilege = mongoose.model("privilege");

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    // origin: true,
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("join_room", data);
    socket.join(data);
  });
  // -----------------usePoint------------------
  socket.on("send_use_point", async (data) => {
    let newUsePoint = [];
    await UsePoint.findById(data.room).then(async (data) => {
      newUsePoint = data;
      //   res.send({ data, message: "success", status: true });
    });
    const valueReduceUseing = newUsePoint.usep_useing.reduce(
      (value, item) => value + item.member_amount,
      0
    );
    const newValueReduceUseing =
      newUsePoint.usep_limited_total - valueReduceUseing;
    socket
      .to(data.room)
      .emit("value_useing_use_point", { ...data, value: newValueReduceUseing });
  });
  // -------------------Privilege------------------
  socket.on("send_privilege", async (data) => {
    let newPrivilege = [];
    await Privilege.findById(data.room).then(async (data) => {
      newPrivilege = data;
      //   res.send({ data, message: "success", status: true });
    });
    const valueReduceUseing = newPrivilege.pvl_useing.reduce(
      (value, item) => value + item.member_amount,
      0
    );
    console.log("then data =>", valueReduceUseing);
    console.log(newPrivilege);
    const newValueReduceUseing =
      newPrivilege.pvl_limited_total - valueReduceUseing;
    console.log(newValueReduceUseing);
    socket
      .to(data.room)
      .emit("value_useing_privilege", { ...data, value: newValueReduceUseing });
  });
});
