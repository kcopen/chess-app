import express from 'express';
import bodyParser from 'body-parser';
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import mongoose from "mongoose";
import { UserModel } from "./../models/users";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../../client/src/shared-libs/socketTypes';
import { UserProfile } from '../../client/src/shared-libs/UserProfile';
import { GameManager } from "./gameManager";

mongoose.connect("mongodb+srv://kncopen:JJsgprAN8MtytNV@chessapp.dktid98.mongodb.net/ChessDB?retryWrites=true&w=majority");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/auth', async (req, res)=>{
    const username: string = req.body.username;
    const password: string = req.body.password;
    if(!username || !password) {
        return res.status(400).json({'message':'Username and password are required.'});
    }
    const user = await UserModel.findOne({username, password}).exec();
    if(!user) return res.sendStatus(401);
    
    res.json(user);
});

app.post("/register", async (req, res)=>{
    const userProfile: UserProfile = req.body;
    const user = await UserModel.findOne({username: userProfile.username}).exec()
    if(user){
        return res.status(400).json({'message':'User already exists.'});
    }
    const newUser = new UserModel({
        ...userProfile,
        chessStats: {
            wins: 0,
            losses: 0,
            draws: 0,
        }

    });
    

    await newUser.save();
    res.json(newUser);
});

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>(server, {
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const gameManager = new GameManager();

io.on("connection", (socket)=>{
    socket.on("login_request", (userProfile)=>{
        if(userProfile){
            socket.data.userProfile = userProfile;
            socket.join(userProfile.username);
            console.log(`Username:${userProfile.username} has logged in.`)
        }
    });
    
    socket.on("join_queue", (user)=>{
        const game = gameManager.joinQueue(user);
        const room = game.getRoom();
        const match = game.getMatch();
        socket.join(room);
        io.to(user.username).emit("current_room_info", room);
        io.to(room).emit("match_update", match);
    });

    socket.on("get_current_game_info",(user: UserProfile)=>{
        const game = gameManager.getUserCurrentGame(user);
        const room = game?.getRoom();
        const match = game?.getMatch();
        if(room && match){
            io.to(user.username).emit("current_room_info", room);
            io.to(user.username).emit("match_update", match);
        }
        
    });

    socket.on("join_chess_room_request", (user, room)=>{
        gameManager.joinGame(room, user);
        const game = gameManager.getGame(room);
        if(game){
            io.to(user.username).emit("current_room_info", room);
            const match = game.getMatch();
            if(match){
                io.to(room).emit("match_update", match);
            }
            
        }
    });

    socket.on("attempt_move", (userProfile, room, move)=>{
        const updatedBoard = gameManager.attemptMove(room, userProfile, move);
        if(updatedBoard){
            const updatedMatch = gameManager.getGame(room)?.getMatch();
            if(updatedMatch){
                io.to(room).emit("match_update", updatedMatch);
            }
        }
    });

    socket.on("resign", (room, userProfile)=>{
        const game = gameManager.getGame(room);
        if(game){
            if(game.attemptResign(userProfile)){
                const match = game.getMatch();
                io.to(room).emit("match_update", match);
            }
        }
    });

    socket.on("request_draw", (room, userProfile)=>{
        const game = gameManager.getGame(room);
        if(game){
            if(game.attemptDraw(userProfile)){
                const match = game.getMatch();
                io.to(room).emit("match_update", match);
            }else {
                socket.to(room).emit("draw_requested", true)
            }
        }
    });

    socket.on("send_chat_message", (userProfile, room, message)=>{
        const game = gameManager.getGame(room);
        if(game?.isPlayerInGame(userProfile)){
            io.to(room).emit("chatbox_update", userProfile.username, message);
        }
    });

    socket.on("disconnect", (reason)=>{
        console.log(`Userid:${socket.id} disconnected from server.`);
    })


})

server.listen(3500, ()=>{
    console.log("SERVER STARTED: Listening on port: 3500");
})

