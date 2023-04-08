const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const history = require('connect-history-api-fallback');
let cors = parseInt(process.env.PROD)?undefined:{cors: {
    origin: "http://localhost:5173"
}}
const io = new Server(server,cors);
let rooms = [];
io.on("connection", (socket) => {
    socket.emit('connected');
    socket.on("createRoom",(roomId)=>{
        socket.join(roomId);
        let roomItem = {
            roomId: roomId,
            whiteTimer: 300,
            whiteInterval: null,
            blackTimer: 300,
            blackInterval: null
        }
        rooms.push(roomItem);
    });
    socket.on("joinRoom",(roomId)=>{
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;
        if(numClients===1){
            socket.join(roomId);
            socket.to(roomId).emit('joined');
        }else{
            socket.emit('roomNotValid');
        }
    });
    socket.on("allPlayersReady",(roomId,color)=>{
        let index = rooms.findIndex((element) => element.roomId === roomId);
        let room = rooms[index];
        let whiteInterval = setInterval(()=>{
            room.whiteTimer --;
            socket.nsp.to(roomId).emit('updateWhiteTimer',room.whiteTimer)
            if(room.whiteTimer === 0){
                socket.nsp.to(roomId).emit('timeout','w')
            }
        },1000)
        room.whiteInterval = whiteInterval;
        socket.to(roomId).emit('gameIsReady',roomId,color);
    });
    socket.on("move",(roomId,move,position)=>{
        socket.to(roomId).emit('enemyMove',move,position);
    })
    socket.on("gameOver",(roomId,status)=>{
        socket.to(roomId).emit('gameOver',status);
    })
    socket.on("toggleTimer",(roomId,color)=>{
        let index = rooms.findIndex((element) => element.roomId === roomId);
        let room = rooms[index];
        if(color === 'w'){
            clearInterval(room.blackInterval);
            room.whiteInterval = setInterval(()=>{
                room.whiteTimer --;
                socket.nsp.to(roomId).emit('updateWhiteTimer',room.whiteTimer)
                if(room.whiteTimer === 0){
                    socket.nsp.to(roomId).emit('timeout','w')
                }
            },1000)
        }else{
            clearInterval(room.whiteInterval);
            room.blackInterval = setInterval(()=>{
                room.blackTimer --;
                socket.nsp.to(roomId).emit('updateBlackTimer',room.blackTimer)
                if(room.blackTimer === 0){
                    socket.nsp.to(roomId).emit('timeout','b')
                }
            },1000)
        }
    })
    socket.on("stopTimers",(roomId)=>{
        let index = rooms.findIndex((element) => element.roomId === roomId);
        let room = rooms[index];
        clearInterval(room.whiteInterval);
        clearInterval(room.blackInterval);
        room.whiteTimer = 300;
        room.blackTimer = 300;
    })
    socket.on("rematch",(roomId)=>{
        socket.to(roomId).emit('rematch');
    })
    socket.on("disconnect", () => {
        console.log('user disconnected');
    });
})
app.use(history());
app.use(express.static(__dirname + '/dist'));
server.listen(3000, () => {
    console.log('listening on *:3000');
});