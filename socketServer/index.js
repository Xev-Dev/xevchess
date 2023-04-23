const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const history = require('connect-history-api-fallback');
let cors = {
    cors:
    {
    origin: process.env.ENV === "prod" ? 
    "https://xevchess.duckdns.org":
    "http://localhost:5173",
    credentials: true,
    }
}
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
            blackInterval: null,
            reconnectionTimer: 30,
            reconnectionInterval: null,
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
        clearInterval(room.reconnectionInterval);
        room.reconnectionTimer = 30;
        room.whiteTimer = 300;
        room.blackTimer = 300;
    })
    socket.on("rematch",(roomId)=>{
        socket.to(roomId).emit('rematch');
    })
    socket.on("startReconnectionTimer",(roomId)=>{
        let index = rooms.findIndex((element) => element.roomId === roomId);
        let room = rooms[index];
        room.reconnectionInterval = setInterval(()=>{
            room.reconnectionTimer --;
            socket.emit('updateReconnectionTimer',room.reconnectionTimer);
            if(room.reconnectionTimer === 0){
                socket.emit('winByDisconnection');
            }
        },1000)
    })
    socket.on("stopReconnectionTimer",(roomId)=>{
        let index = rooms.findIndex((element) => element.roomId === roomId);
        let room = rooms[index];
        clearInterval(room.reconnectionInterval);
        room.reconnectionTimer = 30;
    })
    socket.on("reconnectOpponent",(item)=>{
        socket.to(item.room).emit("reconnectionInfo",item);
    })
    socket.on('disconnecting', function(){
        let room = "";
        socket.rooms.forEach((element)=>{
            room = element;
        });
        socket.to(room).emit("disconnected");
    });
    
})
app.use(history());
app.use(express.static(__dirname + '/dist'));
server.listen(3000, () => {
    console.log('listening on *:3000');
});