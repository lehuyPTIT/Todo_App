const { Renderer } = require("electron");
const fs = require('fs-extra')
const { ipcRenderer } = require('electron');

document.getElementById("submitbutton").addEventListener("click",sendEmail);

function sendEmail(){
    ipcRenderer.send('send-email', 'true');
}

var activeDoing=true;
var activeCompleted=false;

function setProcess(data){
    let leg=data.length;
    let a1=data.reduce((a,b)=>{
        if(b.type==2)a++;
        return a;
    },0);
    let a2=data.reduce((a,b)=>{
        if(b.type==3)a++;
        return a;
    },0);
    document.getElementById("complate").style.width =a2/leg*100+"%";
    document.getElementById("doingProcess").style.width =a1/leg*100+"%";
}
function changeActive(){
    activeDoing=!activeDoing;
    console.log(activeDoing)
    if(activeDoing){
        document.getElementById("doing").style.display="block";
        document.getElementById("act").classList.remove("fa-rotate-180");
        document.getElementById("act").classList.add("fa-rotate-270");
    }
    else{
        document.getElementById("doing").style.display="none";
        document.getElementById("act").classList.remove("fa-rotate-270");
        document.getElementById("act").classList.add("fa-rotate-180");
    }
}

function changeActiveComp(){
    activeCompleted=!activeCompleted;
    console.log(activeCompleted)
    if(activeCompleted){
        document.getElementById("completed").style.display="block";
        document.getElementById("actComp").classList.remove("fa-rotate-180");
        document.getElementById("actComp").classList.add("fa-rotate-270");
    }
    else{
        document.getElementById("completed").style.display="none";
        document.getElementById("actComp").classList.remove("fa-rotate-270");
        document.getElementById("actComp").classList.add("fa-rotate-180");
    }
}


function render(data){
    var task = "";
    var doing = "";
    var completed = "";
    setProcess(data);
    if(data.length){
        for (var i = 0; i < data.length; i++) {
            if(data[i].type===1){
                task += "<div class='item'>"+"<span class='content'>"+ data[i].title + "</span>"+"<span><i class='fas fa-times' onClick='onClose("+data[i].id+")'></i> <i class='fas fa-pause' onClick='onDoing("+data[i].id+")'></i> <i class='fas fa-check' onClick='onCompleted("+data[i].id+")'></i></span>"+"</div>"
            }
            if(data[i].type===2){
                doing+="<div class='item'>"+"<span class='content'>" + data[i].title + "</span>"+"<span><i class='fas fa-times' onClick='onClose("+data[i].id+")'></i><i class='fas fa-check' onClick='onCompleted("+data[i].id+")'></i></span>"+"</div>"
            }
            if(data[i].type===3){
                completed+="<div class='item'>"+"<span class='content'>" + data[i].title +"</span>"+"</div>"
            }
        }
        document.getElementById("bbb").innerHTML = task;
        document.getElementById("doing").innerHTML = doing;
        document.getElementById("completed").innerHTML = completed;
    }
    else{
        document.getElementById("bbb").innerHTML = "";
        document.getElementById("doing").innerHTML = "";
        document.getElementById("completed").innerHTML = "";
    }
}
function loadJSON(filename = '""') {
    return fs.readJsonSync(filename)
    
}
function saveJSON(filename = "", json = ""){
    return fs.writeJsonSync(filename, json);
}


render(loadJSON("./data.json"));

var date = new Date();
let month = date.getMonth();
let arrMonth = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
let arrDay=["Monday","Tuesday","Wedneswday","Thyrsday","Friday","Saturday"]

document.getElementById("date").innerHTML = date.getDate();
document.getElementById("month").innerHTML = arrMonth[month];
document.getElementById("year").innerHTML = date.getFullYear();
document.getElementById("aaa").innerHTML=arrDay[date.getDay()];
function onClose(id){

    var data=loadJSON("./data.json");
    data=data.filter((i)=>{
        if(i.id!=id){
            return i;
        }
    });
    saveJSON("data.json", data);
    render(data);
}
function onDoing(id){
    var data=loadJSON("./data.json");
    data=data.map((i)=>{
        if(i.id==id){
            i.type=2;
        }
        return i;
    });
    saveJSON("data.json", data);
    render(data);
}
function onCompleted(id){
    var data=loadJSON("./data.json");
    data=data.map((i)=>{
        if(i.id==id){
            i.type=3;
        }
        return i;
    });
    saveJSON("data.json", data);
    render(data);
}
function onSave() {
    var input = document.getElementById("task").value;
    var data = loadJSON("./data.json");
    let id;
    if (data.length) {
        id = data[data.length - 1].id + 1;
    } else id = 1;
    if (input == "") return;
    data.push({ id: id, title: input, type: 1 })
    console.log(data,"data save");
    saveJSON("data.json", data);
    render(data);
}
document.getElementById("resetBtn").addEventListener("click",()=>{
    var data = loadJSON("./data.json");
    console.log("!!")
    data=data.map((i)=>{
        i.type=1;
        return i});
    render(data);
    saveJSON("./data.json",data);

})
document.getElementById("submit").addEventListener("click", onSave);

