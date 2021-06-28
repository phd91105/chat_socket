import express from "express";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));
app.get("/", (_, res) => {
  res.sendFile("views/index.html", { root: path.resolve() });
});

io.on("connection", (socket) => {
  console.log(`client_id: ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`client_id: ${socket.id} disconnect`);
  });
  socket.on("Client-send-data", (data) => {
    io.sockets.emit("Server-send-data", `${socket.id}: ${data}`);
  });
  socket.on("Client-typing-data", (data) => {
    io.sockets.emit("Server-typing-data", `${data}`);
  });
});

server.listen(process.env.PORT || 8080);
