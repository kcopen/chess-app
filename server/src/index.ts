import express from 'express';
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
app.use(cors());





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
            UserModel.findOne({username: userProfile.username, password: userProfile.password},(err: any,result: UserProfile)=>{
                if(err){
                    //handle errors
                } else {
                    if(result && result.username === userProfile.username && result.password === userProfile.password){
                        socket.data.userProfile = userProfile;
                        socket.join(userProfile.username);
                        io.to(userProfile.username).emit("login_response", result);
                        console.log(`Username:${userProfile.username} has logged in.`)
                    }
                }
            })
        }
    });

    socket.on("register_request", async (userProfile)=>{
        const newUser = new UserModel({
            ...userProfile,
            chessStats: {
                wins: 0,
	            losses: 0,
	            draws: 0,
            }

        });

        await newUser.save();
        socket.data.userProfile = userProfile;
        socket.join(userProfile.username);
        io.to(userProfile.username).emit("register_response", userProfile);
        console.log(`Username:${userProfile.username} has logged in.`)
    });
    
    socket.on("join_queue", (user)=>{
        const game = gameManager.joinQueue(user);
        const room = game.getRoom();
        const playerColor = game.getPlayerColor(user);
        const board = game.getBoard();
        socket.join(room);
        io.to(user.username).emit("current_game_info", room, playerColor);
        io.to(room).emit("board_update", board);
    });

    socket.on("get_current_game_info",(user: UserProfile)=>{
        const game = gameManager.getUserCurrentGame(user);
        const room = game?.getRoom();
        const playerColor = game?.getPlayerColor(user);
        if(room && playerColor){
            io.to(user.username).emit("current_game_info", room, playerColor);
        }
        
    });

    socket.on("join_chess_room_request", (userProfile, room)=>{
        gameManager.joinGame(room, userProfile);
        const game = gameManager.getGame(room);
        const playerColor = game?.getPlayerColor(userProfile);
        if(game){
            if(playerColor){
                io.to(room).emit("current_game_info", room, playerColor);
            }
            io.to(room).emit("board_update", game.getBoard());
        }
    });

    socket.on("attempt_move", (userProfile, room, move)=>{
        const updatedBoard = gameManager.attemptMove(room, userProfile, move);
        if(updatedBoard){
            io.to(room).emit("board_update", updatedBoard);
        }
    })

    socket.on("disconnect", (reason)=>{
        console.log(`Userid:${socket.id} disconnected from server.`);
    })


})

server.listen(30690, ()=>{
    console.log("SERVER STARTED: Listening on port: 30690");
})

