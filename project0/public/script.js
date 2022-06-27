const peer = new Peer(undefined,{host:'/',port:'3001'});
const socket = io('/')
let myID;
const videogrid = document.getElementById('video-grid')
const myvideo = document.createElement('video')
myvideo.muted = true;
let myVideoStream;
const peers ={}
navigator.mediaDevices.getUserMedia({
    video:true,audio:true
}).then(stream=>{
    myVideoStream = stream;
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
    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', myID,text.val());
        text.val('')
      }
    });
    socket.on("createMessage", (senderID,message) => {
      $("ul").append(`<li class="message"><b>${senderID}</b><br/>${message}</li>`);
      scrollToBottom()
    })
})
socket.on('user-disconnected',userID=>{
    console.log(userID);
   if(peers[userID]) peers[userID].close()
})
peer.on('open',id=>{
    myID = id;
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
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  
  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;}