if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
  
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
  }
  
  function addItem() {
    const newItem = document.getElementsByClassName("item-name")[0];
    const listAllItem = document.getElementById("list-item");
    if (newItem.value !== "") {
      let data = item(newItem.value);
      listAllItem.append(data);
      for (let i = 0; i < listAllItem.childElementCount; i++) {
        const deleteBtn = listAllItem.getElementsByClassName("delete")[i];
        deleteBtn.addEventListener("click", deleteItem);
  
        const doLaterBtn = listAllItem.getElementsByClassName("do-later")[i];
        doLaterBtn.addEventListener("click", addDoLater);
  
        const completedBtn = listAllItem.getElementsByClassName("completed")[i];
        completedBtn.addEventListener("click", addCompleted);
      }
      newItem.value = "";
      updateProgress();
    }
  }
  
  function item(name) {
    let itemRow = document.createElement("div");
    itemRow.classList.add("item");
    itemRow.classList.add("border-radius");
    itemRow.classList.add("flex-between-center");
    let itemContent = `
      <div class="name">${name}</div>
      <div class="action flex-between-center">
        <div class="delete pointer"></div>
        <div class="do-later pointer"></div>
        <div class="completed pointer"></div>
      </div>
    `;
    itemRow.innerHTML = itemContent;
    return itemRow;
  }
  
  function deleteItem(e) {
    let item = e.target.parentNode;
    item.closest(".item").remove();
    updateProgress();
  }
  
  function addDoLater(e) {
    const completedIcon = `<div class="completed pointer"></div>`;
    const doLaterList = document.getElementById("do-later-list");
    let item = e.target.parentNode.closest(".item");
    let cloneItem = item.cloneNode(true);
    item.remove();
    cloneItem.getElementsByClassName("do-later")[0].remove();
    if (cloneItem.getElementsByClassName("completed").length === 0) {
      cloneItem
        .getElementsByClassName("action")[0]
        .insertAdjacentHTML("beforeend", completedIcon);
    }
    doLaterList.append(cloneItem);
    doLaterList.parentNode.querySelector(".action-type").classList.add("active");
    doLaterList.style.maxHeight = doLaterList.scrollHeight + "px";
    for (let i = 0; i < doLaterList.childElementCount; i++) {
      const deleteBtn = doLaterList.getElementsByClassName("delete")[i];
      deleteBtn.addEventListener("click", deleteItem);
  
      const completedBtn = doLaterList.getElementsByClassName("completed")[i];
      completedBtn.addEventListener("click", addCompleted);
    }
    updateProgress();
  }
  
  function addCompleted(e) {
    const doLaterIcon = `<div class="do-later pointer"></div>`;
    const completedList = document.getElementById("completed-list");
    let item = e.target.parentNode.closest(".item");
    let cloneItem = item.cloneNode(true);
    item.remove();
    cloneItem.getElementsByClassName("completed")[0].remove();
    if (cloneItem.getElementsByClassName("do-later").length === 0) {
      cloneItem
        .getElementsByClassName("action")[0]
        .insertAdjacentHTML("beforeend", doLaterIcon);
    }
    completedList.append(cloneItem);
    completedList.parentNode
      .querySelector(".action-type")
      .classList.add("active");
    completedList.style.maxHeight = completedList.scrollHeight + "px";
    for (let i = 0; i < completedList.childElementCount; i++) {
      const deleteBtn = completedList.getElementsByClassName("delete")[i];
      deleteBtn.addEventListener("click", deleteItem);
  
      const doLaterBtn = completedList.getElementsByClassName("do-later")[i];
      doLaterBtn.addEventListener("click", addDoLater);
    }
    updateProgress();
  }
  
  function reset() {
    let item = document.getElementsByClassName("item");
    while (item[0]) {
      item[0].parentNode.removeChild(item[0]);
      updateProgress();
    }
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
    const countDoLaterItems = document.getElementById("do-later-list")
      .childElementCount;
    const countCompletedItems = document.getElementById("completed-list")
      .childElementCount;
    const completedPercent = (countCompletedItems / countItems) * 100;
    const doLaterPercent = (countDoLaterItems / countItems) * 100;
    const completedProgress = document.getElementById("completed-progress");
    const doLaterProgress = document.getElementById("do-later-progress");
    if (countItems > 0) {
      completedProgress.style.width = completedPercent + "%";
      doLaterProgress.style.width = doLaterPercent + "%";
    } else {
      completedProgress.style.width = "0%";
      doLaterProgress.style.width = "0%";
    }
  }
  