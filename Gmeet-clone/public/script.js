const socket =io("/")
const videoGrid=document.getElementById('video-grid')
const myPeer=new Peer(undefined,{
    host: '/',
    port: '3001'
})

let myId;
// let myName=function(myId);
const peers={};
let myVideoStream;

const myVideo=document.createElement('video')
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;

 addVideoStream(myVideo,stream)
 console.log("hey12");
myPeer.on('call',call=>{

    call.answer(stream);
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
})
console.log("hey11");

socket.emit('ready');
console.log("heyhey");
socket.on('user-connected',userId=>{
    console.log("hey1");

    connectToNewUser(userId,stream);
})

let text = $("input");
// when press enter send message
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    console.log("key down",vish);
    socket.emit('message',vish,text.val());
    text.val('')
  }
});

socket.on('createMessage', (senderId,message)=>{
    console.log(vish);
  $('ul').append(`<li class="messages"> <b>${senderId}</b><br/>${message}</li>`)
    scrollToBottom();

})
})


socket.on("user-disconnected",userId=>{
if(peers[userId])
peers[userId].close();
})

myPeer.on('open',id=>{
    myId=id;
    socket.emit("pee_to_mon",id);
    console.log(id);
    socket.emit('join-room',ROOM_ID,id)
})


function connectToNewUser(userId,stream){
    console.log("hey");
    const call=myPeer.call(userId,stream);
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove();
    })

peers[userId]=call;

}

function addVideoStream(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    videoGrid.append(video);
}





const scrollToBottom=()=>{
    let d=$('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute video
const muteUnmute=()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton=()=>{
    const html=`
    <i class="unmute  fas fa-microphone-slash"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const  setUnmuteButton=()=>{
    const html=`
    <i class=" fas fa-microphone"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}


//video on off
const video=()=>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setVideoButton();
    }
    else{
        unSetVideoButton();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}
const setVideoButton=()=>{
    const html=`
    <i class="fa-solid fa-video"></i>
    <span>Camera on </span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}
const  unSetVideoButton=()=>{
    const html=`
    <i class="unmute fa-solid fa-video-slash"></i>
     <span>Camera off </span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}

