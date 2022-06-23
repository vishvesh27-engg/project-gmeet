//headers
const express = require('express')
const app = express()
const http = require('http')
const  socket  = require('socket.io')
const server = http.Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

//middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
//requests
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  });
app.get('/:room',(req,res)=>{
    res.render('room',{roomID:req.params.room})
})
io.on('connection',socket=>{
socket.on('join-room',(roomID,userID)=>{console.log(roomID,userID);
    socket.join(roomID);
    socket.on('ready',()=>{socket.to(roomID).emit('user-connected',userID);})
    socket.on('disconnect',()=>{
        socket.to(roomID).emit('user-disconnected',userID)
    })
});
}
);
server.listen(3000);
