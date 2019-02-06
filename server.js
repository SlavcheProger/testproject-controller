const express = require('express');
const fs = require("fs");
const https = require('https');
const path = require('path')
const bodyparser = require('body-parser');

const app = express();
const directoryToServe = 'views';
const ip =  "192.168.1.4";
const port = 3000;
/*
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('./views'))
app.use("/images", express.static('./images'))
*/
app.use('/', express.static('./views'))
app.get('/hostpage', (req, rsp) => {
    rsp.sendFile(__dirname + '/views/hostpage.html');
});
const httpsOptions = {
    cert: fs.readFileSync("./ssl/server.crt"),
    key: fs.readFileSync("./ssl/server.key")
}

https.createServer(httpsOptions,app)
    .listen(port, function(){
        console.log('Server is running on  '+ ip + ':' + port)
       // console.log('cert: ' + httpsOptions.cert)
        //console.log('key: ' + httpsOptions.key)
    });
/////////
/*
const express = require('express');
const expressws = require('express-ws');
const bodyparser = require('body-parser');
const app = express();
const fs = require("fs");
*/


/*
app.get('/controller', (req, rsp) => {
    rsp.sendFile(__dirname + '/views/controller.html');
});
app.get('/hostpage', (req, rsp) => {
    rsp.sendFile(__dirname + '/views/hostpage.html');
});

expressws(app);


const clients = {};
let connections = [];

app.ws('/', (ws, req) => {

    let id = Math.random();
    clients[id] = ws;
    console.log("Новое соединение: ", id);
    
    ws.on('message', function (data) {
        console.log('Получены данные: ' + data);
        
        data = JSON.parse(data);
        let statusObj = data[0];
        data.shift();

        switch (statusObj.type) {                     
            case "new_host":    
                    var token = randomInteger();
                    var connection = {hostID:id, controllerID:null,code:token};
                    connections.push(connection);
                    console.log(connections);
                    sendBack(clients[id], "show_host_code", token);              
            break;
            case "enter_code":   
                    for(let c of connections){
                        if(c.code == data[0]){
                            console.log(true)
                            c.controllerID = id;
                            sendBack(clients[c.hostID], "succeed_connection_host", null);
                            sendBack(clients[id], "succeed_connection_controller", null);
                        }
                    }
            break;
        }
    });

    ws.on('close', function () {
        console.log('Соединение закрыто')
        delete clients[id];
    })
})

app.listen(3000, function () {
    console.log("Server running on port 3000")
});

function randomInteger() {
  var rand = 1000000 + Math.random() * (9999999 - 1000000)
  rand = Math.round(rand);
  return rand;
}

let updateUser = (user) =>{

    let data = readData("users");
    for (let d in data) {
        if (data[d].login == user.login){
            data[d].id = user.id;
            data[d].password = user.password; 
            let fd = fs.openSync("./db/users.json", "w");
            fs.writeFile(fd, JSON.stringify(data), ()=>{
                console.log("# USER <" + data[d].login + "> CHANGED");
                fs.closeSync(fd);
                return true;     
            });
            return true;
        }
    }
       return false;
};
let sendBack = (ws, contentType, data) =>{

    let obj = {type: contentType};
    let dataForSending = [obj,data];
    // console.log("ws ", clients[usersId]);
    ws.send(JSON.stringify(dataForSending));
};

let writeData = (filename, data) => {

    let arr = readData(filename);
    arr.push(data);

    let fd = fs.openSync("./db/" + filename + ".json", "w");
    fs.writeFile(fd, JSON.stringify(arr), ()=>{
        fs.closeSync(fd);
    });
};
let readData = (filename) => {
    let fd = fs.openSync("./db/" + filename + ".json", "r");
    let data = fs.readFileSync(fd);
    data = JSON.parse(data);
    fs.closeSync(fd); 
    return data;
};
let signUp = (user) => {
    let data = readData("users");

    for (let d in data) {

        if (user.email == data[d].email || user.login == data[d].login) {
            console.log("# SIGNUP FAILED <" + user.login + ">");
            return false;
        }
    }
    user.fio = "";
    user.id = "";
    writeData("users", user);
    console.log("# ADDED NEW USER: <" + user.login + ">");
    return true;
};
let login = (login, password) => {

    let data = readData("users");
    console.log("data ", data);
    for (let d in data) {
        if (login == data[d].login && password == data[d].password) {
            console.log("# USER <" + login + "> LOGED IN");
            return data[d];
        }
    }
    console.log("# LOGIN FAILED <" + login + ">");
    return undefined;
};

let getDates = (login) => {

    let data = readData("dates");
    let daysArr = [];
    for (let d in data) {
        if (data[d].user == login)
            daysArr.push(data[d].date);
    }
    return daysArr;
};
let getSMS = (us1, us2) => {

    let data = readData("dates");
    let daysArr = [];
    for (let d in data) {
        if (data[d].us1 == us1 && data[d].us2 == us2 || data[d].us1 == us2 && data[d].us2 == us1)
            daysArr.push(data[d].date);
    }
    return daysArr;
};
let getTrainNotes = (login, date) => {

    let data = readData("notes");
    let notesArr = [];
    for (let d in data) {
        try{
        if (data[d].user == login && data[d].date == date)
            notesArr.push(data[d]);
        }
        catch(ex){}
    }
    return notesArr;
};
let checkDate = (login, date) => {

    let data = readData("dates");
    for (let d in data) {
        if (data[d].user == login && data[d].date == date)
            return true;
    }
    return false;
};

let updateNotes = (notes) => {
    
    let data = readData("notes");
    let login = notes[0][0].user;
    let date = notes[0][0].date;
    let arr = [];
    console.log(login, date);
    
    for (let d =0; d< data.length; d++) {
        try{
        if (login == data[d].user && date == data[d].date) {
            //d++;
        }
        else arr[d] = data[d];
    }
    catch(ex){}
    }
    //console.log("data 1 " + data);
    for(let i in notes[0]){
        arr.push(notes[0][i]);
    console.log(arr)
    }
    //console.log("data 2 " + data);
    

    let fd = fs.openSync("./db/notes.json", "w");
    fs.writeFile(fd, JSON.stringify(arr), ()=>{
        fs.closeSync(fd);
    });
};
let getUserByLogin = (login) => {

    let data = readData("users");
    for (let d in data) {
        if (data[d].login == login)
            return data[d];
    }
    return undefined;
};

let getUserByEmail = (email) => {

    let data = readData("users");
    for (let d in data)
        if (data[d].email == email)
            return data[d];
    return undefined;
};
let getUserById = (id) => {

    let data = readData("users");
    for (let d in data)
        if (data[d].id == id)
            return data[d];
    return undefined;
};
*/