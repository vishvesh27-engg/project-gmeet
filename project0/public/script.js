const peer = new Peer(undefined,{host:'/',port:'3001'});
const socket = io('/')
const videogrid = document.getElementById('video-grid')
const myvideo = document.createElement('video')
myvideo.muted = true;
const peers ={}
navigator.mediaDevices.getUserMedia({
    video:true,audio:true
}).then(stream=>{
    addvideostream(myvideo,stream)
    peer.on('call',call=>{
        
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',uservideostream=>{
            addvideostream(video,uservideostream)
        })
    })
    socket.emit('ready')
    socket.on('user-connected',userID=>{
       
        connecttonewuser(userID,stream)
    })
})
socket.on('user-disconnected',userID=>{
    console.log(userID);
   if(peers[userID]) peers[userID].close()
})
peer.on('open',id=>{
    socket.emit('join-room',roomid,id)

})
function connecttonewuser(userID,stream)
{   
    const call = peer.call(userID,stream)
    
    const video = document.createElement('video')
    call.on('stream',uservideostream=>{
        
        addvideostream(video,uservideostream)
    })
    call.on('close',()=>{
        video.remove()
    })
    peers[userID]=call;
}
function addvideostream(video,stream)
{
    video.srcObject = stream;
video.addEventListener('loadedmetadata',()=>{video.play()})
   
    videogrid.append(video)
}