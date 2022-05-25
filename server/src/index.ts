import express from 'express';
import http from "http";
import cors from "cors";
import {Server} from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket)=>{
    console.log(`Userid:${socket.id} connected to server.`);

    socket.on("join_chess_room", (payload)=>{
        socket.join(payload)
    })


})

server.listen(3001, ()=>{
    console.log("SERVER STARTED");
})

