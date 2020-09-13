const { ipcRenderer } = require('electron');

ipcRenderer.on('TaskItems:Initial', (event, data) => {
    try {
        const taskList = JSON.parse(data);
        taskList.forEach(taskItem => {
            if (taskItem.status === "doing") {

            } else if (taskItem.status === "paused") {

                numPausingTasks += 1;
            } else if (taskItem.status === "completed") {

            }
        });
        updateProgressBar(data)
    } catch (error) {
        console.log(error);
    }
})

function updateProgressBar(data) {
    var coutDoing, countCompleted, coutPaused;

    try {
        const taskList = JSON.parse(data);
        taskList.forEach(taskItem => {
            if (taskItem.status === "doing") {
                coutDoing++;
            } else if (taskItem.status === "paused") {
                countCompleted++;
            } else if (taskItem.status === "completed") {
                coutPaused++;
            }
        });
    } catch (error) {
        console.log(error);
    }
    var completePrecent = 100 * countCompleted / taskList.length();
    var pausedPrecent = 100 * coutPaused / taskList.length();
    var completed = document.querySelector(".completed");
    var paused = document.querySelector(".paused");
    completed.style.width = "completePrecent%";
    paused.style.width = "pausedPrecent%";

}