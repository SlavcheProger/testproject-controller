let ip = document.location.host; //"192.168.1.4:3000";
const socket = new WebSocket("ws://" + ip);
//let type = document.location.pathname;

const sendMessage = (categoryName, sendData) => {
    
    let category = {type:categoryName};
    let data = [category,sendData];
    data = JSON.stringify(data);
    socket.send(data);
};

window.onload = function(){

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia({ audio: true, video: true }, gotStream, streamError);

var hostButon = document.getElementById("hostButon");
var controllerButton = document.getElementById("controllerButton");
var sendButton = document.getElementById("sendButton");
var codeField = document.getElementById("code");
var title1 = document.getElementById("title1");
var title2 = document.getElementById("title2");

socket.onopen = function () {
    console.log("Соединение установлено");
        
    hostButon.onclick = (e)=>{
        sendMessage("new_host",null);
        hostButon.style.display = "none";
        controllerButton.style.display = "none";
    };
    controllerButton.onclick = (e)=>{
        sendMessage("new_controller",null);
        hostButon.style.display = "none";
        controllerButton.style.display = "none";
        sendButton.style.display = "block";
        codeField.style.display = "block";
        title1.innerText = "";
        title2.innerText = "Please, enter code to connect to the host";
    };
    sendButton.onclick = (e)=>{
        var code = codeField.value;
        sendMessage("enter_code",code);
    };
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    }
    else {
        console.log('Обрыв соединения');
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event) {

    console.log("Получено сообщение: " + event.data); 
    
    let parsedData = JSON.parse(event.data);
    let statusObj = parsedData[0];
    parsedData.shift();

    switch(statusObj.type){
        
        case "message":
            console.log(parsedData);
            
        break;
        case "show_host_code":
            title1.innerText = "Please, enter this code on your controller device";
            title2.innerText = parsedData[0];    
        break;
        case "succeed_connection_host":
            title2.innerText = ip+"/hostpage"
            window.open("http://"+ip+"/hostpage");         
        break;
        case "succeed_connection_controller":
            title2.innerText = ip+"/controller"
            window.open("http://"+ip+"/controller");         
        break;
    }    
};

socket.onerror = function(error) {
    console.log("Ошибка " + error.message);
};

}     