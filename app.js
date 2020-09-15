const electron = require("electron");
const ipc = electron.ipcRenderer;

var dataListItems = [];
var dataDoingList = [];
var dataCompletedList = [];

const saveData = () => {
    let data_json = {
        listItem: dataListItems,
        doing: dataDoingList,
        completed: dataCompletedList
    }
    ipc.send('store-data', data_json);
}

ipc.send('did-finish-load');
ipc.on('onload-data', (event, arg) => {
    render(arg);
    updateProgress();
})

function getWeekDay(date) {
    var weekdays = new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    var day = date.getDay();
    return weekdays[day];
}

function getMonthText(date) {
    var months = new Array(
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    );
    var month = date.getMonth();
    return months[month];
}

function currentDate() {
    var current = new Date();
    var day = document.querySelector(".day").innerHTML = current.getDate();
    var day = document.querySelector(".month").innerHTML = getMonthText(current);
    var day = document.querySelector(".year").innerHTML = current.getFullYear();
    var day = document.querySelector(".today").innerHTML = getWeekDay(current);
}


function render(jsonData) {
    const items = document.getElementById("list-item");
    const doingItems = document.getElementById("doing-list");
    const completedItems = document.getElementById("completed-list");

    dataListItems = jsonData.listItem;
    dataDoingList = jsonData.doing;
    dataCompletedList = jsonData.completed;

    showListItem(dataListItems, items);
    showListItem(dataDoingList, doingItems);
    showListItem(dataCompletedList, completedItems);
    updateProgress(jsonData);
}


function showListItem(listItem, items) {
    items.innerHTML = "";
    for (let i = 0; i < listItem.length; i++) {
        item(listItem[i], items);
    }
}

const addBtn = document.getElementById("createTodoBtn");
addBtn.addEventListener("click", addItem);

function addItem() {
    const newItem = document.getElementById("newTask");
    const items = document.getElementById("list-item");
    if (newItem.value != "") {
        item(newItem.value, items);
        dataListItems.push(newItem.value);
        newItem.value = "";
        updateProgress();
        saveData();
    }
}

function item(name, items) {
    let itemRow = document.createElement("div");
    itemRow.classList.add("item")
    let itemContent = `
      <div class="name">${name}</div>
      <div class="buttons">
        <div class="delete"></div>
        <div class="doing"></div>
        <div class="complete"></div>
      </div>
    `;
    itemRow.innerHTML = itemContent;
    items.append(itemRow);
    for (let i = 0; i < items.childElementCount; i++) {
        const deleteBtn = items.getElementsByClassName("delete")[i];
        deleteBtn.addEventListener("click", deleteItem);

        const doLaterBtn = items.getElementsByClassName("doing")[i];
        doLaterBtn.addEventListener("click", addDoing);

        const completedBtn = items.getElementsByClassName("complete")[i];
        completedBtn.addEventListener("click", addComplete);
    }
}


function removeArrayElementByValue(arrayName, value) {
    let array = null;
    if (arrayName === "list-item") {
        array = dataListItems;
    } else if (arrayName === "doing-list") {
        array = dataDoingList;
    } else {
        array = dataCompletedList;
    }
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function deleteItem(e) {
    let item = e.target.parentNode;
    let taskName = item.closest(".item").textContent.trim();
    let taskType = item.closest(".item").parentNode.id;
    removeArrayElementByValue(taskType, taskName);
    item.closest(".item").remove();
    updateProgress();
    saveData();
}

function addDoing(e) {
    const doingList = document.getElementById("doing-list");
    let item = e.target.parentNode.closest(".item");
    let cloneItem = item.cloneNode(true);
    let taskName = item.textContent.trim();
    let taskType = item.parentNode.id;
    removeArrayElementByValue(taskType, taskName);
    item.remove();
    doingList.append(cloneItem);
    dataDoingList.push(taskName);
    for (let i = 0; i < doingList.childElementCount; i++) {
        const deleteBtn = doingList.getElementsByClassName("delete")[i];
        deleteBtn.addEventListener("click", deleteItem);

        const doLaterBtn = doingList.getElementsByClassName("doing")[i];
        doLaterBtn.addEventListener("click", addDoing);

        const completedBtn = doingList.getElementsByClassName("complete")[i];
        completedBtn.addEventListener("click", addComplete);
    }
    updateProgress();
    saveData();
}

function addComplete(e) {
    const completedList = document.getElementById("completed-list");
    let item = e.target.parentNode.closest(".item");
    let cloneItem = item.cloneNode(true);

    let taskName = item.textContent.trim();
    let taskType = item.parentNode.id;
    removeArrayElementByValue(taskType, taskName);
    item.remove();
    dataCompletedList.push(taskName);
    completedList.append(cloneItem);
    for (let i = 0; i < completedList.childElementCount; i++) {
        const deleteBtn = completedList.getElementsByClassName("delete")[i];
        deleteBtn.addEventListener("click", deleteItem);

        const doLaterBtn = completedList.getElementsByClassName("doing")[i];
        doLaterBtn.addEventListener("click", addDoing);

        const completedBtn = completedList.getElementsByClassName("complete")[i];
        completedBtn.addEventListener("click", addComplete);
    }
    updateProgress();
    saveData();
}

function updateProgress() {

    const sumTask = dataListItems.length + dataDoingList.length + dataCompletedList.length;
    const completedProgress = document.querySelector(".completed-progress");
    const doingProgress = document.querySelector(".doing-progress");
    if (sumTask > 0) {

        const completedPercent = (dataCompletedList.length / sumTask) * 100;
        const doingPercent = (dataDoingList.length / sumTask) * 100;
        completedProgress.style.width = completedPercent + "%";
        doingProgress.style.width = doingPercent + "%";
    } else {
        completedProgress.style.width = "0%";
        doingProgress.style.width = "0%";
    }
}

const resetTask = document.querySelector(".reset");
resetTask.addEventListener("click", resetData);

function resetData() {
    console.log("reset data");
    dataListItems = [];
    dataDoingList = [];
    dataCompletedList = [];
    saveData();
    updateProgress();
    ipc.send('did-finish-load');
}

const sendMain = document.querySelector(".sendMain");
sendMain.addEventListener('click', () => {
    ipc.send('send-email', "triggerd");
})

$(document).ready(function() {
    $(".toggle-list-doing").click(function() {
        $(".panel-doing").slideToggle();
    });
});
$(document).ready(function() {
    $(".toggle-list-completed").click(function() {
        $(".panel-completed").slideToggle();
    });
});
currentDate();