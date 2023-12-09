const express = require("express");
const bodyParse = require("body-parser");
const moogooes = require("mongoose");
const cors = require("cors");
// const { socketConnection } = require('./app/socket/connection');
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const errorHandler = require("./app/middlewares/errorHandler");
const authRouter = require("./app/routes/auth.routes");
const groupRouter = require("./app/routes/group.routes");
const groupTaskRouter = require("./app/routes/grouptask.routes");
const PORT = process.env.PORT || 5000;
const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//   },
// });
// const io = socketConnection(server);

app.use(bodyParse.json()); // for parsing application/json
app.use(bodyParse.urlencoded({ extended: true }));
app.use(cors());

app.use(`${process.env.API_VERSION}/auth`, authRouter);
app.use(`${process.env.API_VERSION}/group`, groupRouter);
app.use(`${process.env.API_VERSION}/group`, groupTaskRouter);

app.use(errorHandler);

moogooes
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(
        `Server has been connected with port http://localhost:${PORT}/api/v1`
      );
    });

    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000",
      },
    });
    console.log("IO:", io);
    io.on("connection", (socket) => {
      // console.log("client connection", socket.id);

      socket.on("join_group", (data) => {
        console.log("join_group", data);
        socket.join(data?.group_id);
      });

      socket.on("leave_group", (data) => {
        socket.leave(data?.group_id);
      });

      socket.on("task_added", (data) => {
        socket
          .to(data?.group_id)
          .emit("task_add_received", { task: data?.task });
      });

      // socket.on('task_delete', (data) => {
      //   socket
      //     .to(data?.group_id)
      //     .emit('task_delete_received', { taskId: data?.id });
      // });

      // socket.on('task_completed', (data) => {
      //   socket
      //     .to(data?.group_id)
      //     .emit('task_completed_received', { taskId: data?.id });
      // });
    });
  })
  .catch((err) => {
    console.log("err", err);
  });
