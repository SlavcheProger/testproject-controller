//const speechRs = require('speech-js'); 

////////
var speechRs=speechRs||{};speechRs.speechinit=function(lang,cb,bcolor,color,pitch,rate){this.speaker=new SpeechSynthesisUtterance();this.speaker.pitch=pitch||1;this.speaker.rate=rate||1;this.lan=lang;var style=document.createElement('style');style.type='text/css';style.innerHTML='.rsClass{background-color:'+(bcolor||"#4f91e6")+';color:'+(color||"#fff")+';}';document.getElementsByTagName('head')[0].appendChild(style);setTimeout(function(){speechRs.speaker.voice=speechSynthesis.getVoices().filter(function(voice){return voice.name==speechRs.lan;})[0];},500);if(lang=='native'){cb(this);}else{setTimeout(function(){cb(speechRs)},1000);}}
speechRs.speak=function(text,cb,isHiligh){let j=0,el,ar=[];speechRs.speaker.voice=speechSynthesis.getVoices().filter(function(voice){return voice.name==speechRs.lan;})[0];this.speaker.onend=function(e){cb(e);};if(typeof text=='string'){this.speaker.text=text;speechSynthesis.speak(this.speaker);}else{if(isHiligh){j=0;el=text;ar=(text.innerHTML).split(".");readop(ar[j]);}else{this.speaker.text=text.innerHTML;speechSynthesis.speak(this.speaker);}}
function readop(x){speechRs.speaker.text=x;if(j!=0){el.querySelector(".rsClass").className="";}
el.innerHTML=(el.innerHTML).replace(ar[j],"<span class='rsClass'>"+ar[j]+"</span>");speechSynthesis.speak(speechRs.speaker);speechRs.speaker.onend=function(e){if(ar.length>(j+1)){readop(ar[++j]);}}}}
speechRs.rec_start=function(l,callback){this.recognition=new webkitSpeechRecognition();this.recognition.continuous=true;this.recognition.interimResults=true;this.arry_com={};this.final_transcript='';this.recognition.lang=l;this.recognition.start();this.ignore_onend=false;this.recognition.onstart=function(c){}
let prev_res='';this.recognition.onresult=function(event){let interim_transcript='';if(typeof(event.results)=='undefined'){speechRs.recognition.onend=null;speechRs.recognition.stop();return;}
for(var i=event.resultIndex;i<event.results.length;++i){if(event.results[i].isFinal){prev_res='';speechRs.final_transcript+=event.results[i][0].transcript;}else{interim_transcript+=event.results[i][0].transcript;}}
console.log(prev_res+","+interim_transcript);if(prev_res!=interim_transcript&&speechRs.arry_com[interim_transcript.toLowerCase().trim()]){prev_res=interim_transcript;speechRs.arry_com[interim_transcript.toLowerCase().trim()]();}else{}
callback(speechRs.final_transcript.replace("undefined",""),interim_transcript);}}
speechRs.on=function(s,f){this.arry_com[s.toLowerCase()]=f;}
speechRs.rec_stop=function(callback){this.recognition.stop();this.recognition.onstop=function(){return callback();}}


//////////
let SpeakText = (text)=>{
    speechRs.speechinit('Google русский',function(e){
	        speechRs.speak(text, function() {
                   
               }, false);	  
     });
};

let status = false
let text = ""

let ListenText = ()=>{

    if (status == false){
        console.log("rec")
        speechRs.rec_start('ru-RU',function(final_transcript,interim_transcript){
            console.log(final_transcript,interim_transcript);
            text = final_transcript;
        }); 
        status = true   
    }
    else{
        speechRs.rec_stop()
        console.log("(*) ", text)
        status = false 
        document.getElementById("testMessage").innerText = text
        return text
    }
};

window.onload = function(){

    
var textField = document.getElementById("textField");
var recordButton = document.getElementById("recordButton");
var canvasField = document.getElementById("canvasField");
var cancasButton = document.getElementById("cancasButton");
var fileButton = document.getElementById("fileButton");

recordButton.onclick = (e)=>{
    var message = ListenText();
    
    //SpeakText("тестовое сообщение");
}             


}
/*
let ip = document.location.host; //"192.168.1.7:3000";
const socket = new WebSocket("ws://" + ip);
let type = document.location.pathname;



// TODO: sort an clear this objects

let profile;
const loginButton = document.getElementById("loginBut");
const signupButton = document.getElementById("signupBut");
const changePassButton = document.getElementById("changePassBut");
const menuButs = document.querySelectorAll("#buts button.rightButtons");
const addBut = document.getElementById("add");
const settingsBut = document.getElementById("settings");
const downBut = document.getElementById("down");
const backBut = document.getElementById("backButton");
const saveBut = document.getElementById("saveButton");
const chatBut = document.getElementById("chat");
const dateBut = document.getElementById("dateButton");
const statisticsBut = document.getElementById("statisticsButton");
const logoutBut = document.getElementById("logout");
let Ulogin, Upassword, Uemail, user;
let lId;
let userID;
let login;
let pass;
let Udata;
let dateOfTraining;


socket.onopen = function () {
    console.log("Соединение установлено");

};


//Закрытие соединения
socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    }
    else {
        console.log('Обрыв соединения');
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
};


//on get message
socket.onmessage = function(event) {

    console.log("Получено сообщение: " + event.data); 
    
    let parsedData = JSON.parse(event.data);
    let statusObj = parsedData[0];
    parsedData.shift();

    switch(statusObj.type){
        
        case "notes": 
            showNotes(parsedData);
        break;
        
    }    
};

//on exception
socket.onerror = function(error) {
    console.log("Exception: " + error.message);
};

*/