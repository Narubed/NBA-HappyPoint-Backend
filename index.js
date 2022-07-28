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

var corsOptions = {
  origin: process.env.CORS_API_WEB,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// routes
app.use(
  "/api/happy-point/uploadImage",
  cors(corsOptions),
  require("./routes/uploadImage")
);
app.use(
  "/api/happy-point/members",
  cors(corsOptions),
  require("./routes/members")
);
app.use(
  "/api/happy-point/login_members",
  cors(corsOptions),
  require("./routes/login_members")
);

// app.use("/api/happy-point/login_members", members);

app.use(
  "/api/happy-point/privilege",
  cors(corsOptions),
  require("./routes/privilege")
);
app.use(
  "/api/happy-point/deleteImage",
  cors(corsOptions),
  require("./routes/deleteImage")
);
app.use(
  "/api/happy-point/report_history",
  cors(corsOptions),
  require("./routes/report.history")
);
app.use(
  "/api/happy-point/recived_point/",
  cors(corsOptions),
  require("./routes/received.point")
);
app.use(
  "/api/happy-point/use_point/",
  cors(corsOptions),
  require("./routes/use.point")
);
app.use(
  "/api/happy-point/point_history",
  cors(corsOptions),
  require("./routes/point.history")
);

const port = process.env.PORT || 9000;
// const server = app.listen(port, console.log(`Listening on port ${port}...`));
app.listen(port, console.log(`Listening on port ${port}...`));

// const io = require("socket.io")(server, {
//   allowEIO3: true,
//   cors: {
//     // origin: true,
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", async (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     console.log("join_room", data);
//     socket.join(data);
//   });
//   // -----------------usePoint------------------
//   const usePointReduce = require("./socket/use.point");
//   socket.on("send_use_point", async (data) => {
//     let newValueReduceUseing = 0;
//     await usePointReduce(data)
//       .then((res) => (newValueReduceUseing = res))
//       .catch(() => (newValueReduceUseing = 0));
//     socket
//       .to(data.room)
//       .emit("value_useing_use_point", { ...data, value: newValueReduceUseing });
//   });
//   // -------------------Privilege------------------
//   const privilegeReduce = require("./socket/privilege");
//   socket.on("send_privilege", async (data) => {
//     let newValueReduceUseing = 0;
//     await privilegeReduce(data)
//       .then((res) => (newValueReduceUseing = res))
//       .catch(() => (newValueReduceUseing = 0));
//     socket
//       .to(data.room)
//       .emit("value_useing_privilege", { ...data, value: newValueReduceUseing });
//   });
// });
