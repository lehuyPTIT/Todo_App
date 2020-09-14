const electron = require("electron");
const ipc = electron.ipcRenderer;

const saveData = () => {
  let rsp_json = {
    listItem : dataListItems,
    doing : dataDoingList,
    completed : dataCompletedList
  }
  ipc.send('store-data', rsp_json);
}

ipc.on('onload-data', (event, arg) => {
  render(arg);
})

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
var dataListItems = [];
var dataDoingList = [];
var dataCompletedList = [];
function ready() {
  var date = new Date();
  var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
  ];
  document.getElementsByClassName("day")[0].innerHTML = date.getDate();
  document.getElementsByClassName(
      "month"
  )[0].innerHTML = date.toDateString().substr(4, 3);
  document.getElementsByClassName("year")[0].innerHTML = date.getFullYear();
  document.getElementsByClassName("day-in-week")[0].innerHTML =
      days[date.getDay()];

  const addBtn = document.getElementById("add-button");
  addBtn.addEventListener("click", addItem);

  const resetProgress = document.getElementById("reset-progress");
  resetProgress.addEventListener("click", reset);

  const coll = document.getElementsByClassName("action-type");
  for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", collapsible);
  }
  ipc.send('did-finish-load');
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
  updateProgress();
}

function reRender() {
  const items = document.getElementById("list-item");
  const doingItems = document.getElementById("doing-list");
  const completedItems = document.getElementById("completed-list");
  showListItem(dataListItems, items);
  showListItem(dataDoingList, doingItems);
  showListItem(dataCompletedList, completedItems);
  updateProgress();
}

function showListItem(listItem, items) {
  items.innerHTML = "";
  for (let i = 0; i < listItem.length; i++) {
      item(listItem[i], items);
  }
}

function addItem() {
  const newItem = document.getElementsByClassName("item-name")[0];
  const items = document.getElementById("list-item");
  if (newItem.value !== "") {
      item(newItem.value, items);
      dataListItems.push(newItem.value);
      newItem.value = "";
      updateProgress();
      saveData();
  }
}

function item(name, items) {
  let itemRow = document.createElement("div");
  itemRow.classList.add("item");
  itemRow.classList.add("border-radius");
  itemRow.classList.add("flex-between-center");
  let itemContent = `
    <div class="name">${name}</div>
    <div class="action flex-between-center">
      <div class="delete pointer"></div>
      <div class="doing pointer"></div>
      <div class="completed pointer"></div>
    </div>
  `;
  itemRow.innerHTML = itemContent;
  items.append(itemRow);
  for (let i = 0; i < items.childElementCount; i++) {
      const deleteBtn = items.getElementsByClassName("delete")[i];
      deleteBtn.addEventListener("click", deleteItem);

      const doLaterBtn = items.getElementsByClassName("doing")[i];
      doLaterBtn.addEventListener("click", addDoing);

      const completedBtn = items.getElementsByClassName("completed")[i];
      completedBtn.addEventListener("click", addCompleted);
  }
}

function removeArrayElementByValue(arrayName, value) {
  let array = null;
  if(arrayName === "list-item"){
    array = dataListItems;
  }
  else if (arrayName === "doing-list"){
    array = dataDoingList;
  }
  else{
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
  const completedIcon = `<div class="completed pointer"></div>`;
  const doingList = document.getElementById("doing-list");
  let item = e.target.parentNode.closest(".item");
  let cloneItem = item.cloneNode(true);
  // Remove from data List
  let taskName = item.textContent.trim();
  let taskType = item.parentNode.id;
  removeArrayElementByValue(taskType, taskName);
  item.remove();
  
  // cloneItem.getElementsByClassName("doing")[0].remove();
  if (cloneItem.getElementsByClassName("completed").length === 0) {
      cloneItem
          .getElementsByClassName("action")[0]
          .insertAdjacentHTML("beforeend", completedIcon);
  }
  doingList.append(cloneItem);
  dataDoingList.push(taskName);
  doingList.parentNode.querySelector(".action-type").classList.add("active");
  doingList.style.maxHeight = doingList.scrollHeight + "px";
  for (let i = 0; i < doingList.childElementCount; i++) {
      const deleteBtn = doingList.getElementsByClassName("delete")[i];
      deleteBtn.addEventListener("click", deleteItem);

      const doLaterBtn = doingList.getElementsByClassName("doing")[i];
      doLaterBtn.addEventListener("click", addDoing);

      const completedBtn = doingList.getElementsByClassName("completed")[i];
      completedBtn.addEventListener("click", addCompleted);
  }
  updateProgress();
  saveData();
}

function addCompleted(e) {
  const doingIcon = `<div class="doing pointer"></div>`;
  const completedList = document.getElementById("completed-list");
  let item = e.target.parentNode.closest(".item");
  let cloneItem = item.cloneNode(true);
  // Remove from data List
  let taskName = item.textContent.trim();
  let taskType = item.parentNode.id;
  removeArrayElementByValue(taskType, taskName);
  item.remove();
  // cloneItem.getElementsByClassName("completed")[0].remove();
  if (cloneItem.getElementsByClassName("doing").length === 0) {
      cloneItem
          .getElementsByClassName("action")[0]
          .insertAdjacentHTML("beforeend", doingIcon);
  }
  dataCompletedList.push(taskName);
  completedList.append(cloneItem);
  completedList.parentNode
      .querySelector(".action-type")
      .classList.add("active");
  completedList.style.maxHeight = completedList.scrollHeight + "px";
  for (let i = 0; i < completedList.childElementCount; i++) {
      const deleteBtn = completedList.getElementsByClassName("delete")[i];
      deleteBtn.addEventListener("click", deleteItem);

      const doLaterBtn = completedList.getElementsByClassName("doing")[i];
      doLaterBtn.addEventListener("click", addDoing);

      const completedBtn = completedList.getElementsByClassName("completed")[i];
      completedBtn.addEventListener("click", addCompleted);
  }
  updateProgress();
  saveData();
}

function reset() {
    dataCompletedList.forEach(element => {
      dataListItems.push(element);
    });
    dataCompletedList = [];
    dataDoingList.forEach(element => {
      dataListItems.push(element);
    })
    dataDoingList = [];
    reRender();
    saveData();
}

function collapsible(e) {
  const thisItem = e.target;
  thisItem.classList.toggle("active");
  let content = thisItem.nextElementSibling;
  if (content.style.maxHeight) {
      content.style.maxHeight = null;
  } else {
      content.style.maxHeight = content.scrollHeight + "px";
  }
}

function updateProgress() {
  const countItems = document.getElementsByClassName("item").length;
  const countDoLaterItems = document.getElementById("doing-list")
      .childElementCount;
  const countCompletedItems = document.getElementById("completed-list")
      .childElementCount;
  const completedPercent = (countCompletedItems / countItems) * 100;
  const doLaterPercent = (countDoLaterItems / countItems) * 100;
  const completedProgress = document.getElementById("completed-progress");
  const doLaterProgress = document.getElementById("doing-progress");
  if (countItems > 0) {
      completedProgress.style.width = completedPercent + "%";
      doLaterProgress.style.width = doLaterPercent + "%";
  } else {
      completedProgress.style.width = "0%";
      doLaterProgress.style.width = "0%";
  }
}
