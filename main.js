const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const DataStore = require('./DataStore')
const todosData = new DataStore({ name: 'Todos' })
let mainWindow;

const storageTasksPath = path.join(app.getPath('userData'), 'data.json');

function createWindow() {
    mainWindow = new BrowserWindow({
        title: "ToDoList",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('index.html')
    fs.readFile(storageTasksPath, (err, data) => {
        if (!err) {
            try {
                const storageData = JSON.parse(data);
                const currentDateString = new Date().toDateString();
                const dataInCurrentDate = storageData[currentDateString] ? storageData[currentDateString] : [];
                mainWindow.webContents.on('did-finish-load', () => {
                    mainWindow.webContents.send("TaskItems:Initial", JSON.stringify(dataInCurrentDate));
                })
            } catch (error) {
                console.log(error);
            }
        }
    })
}
// process add task item
ipcMain.on('TaskItem:add', (event, message) => {
    fs.readFile(storageTasksPath, (err, data) => {
        if (!err) {
            try {
                const storageData = JSON.parse(data);
                const addData = JSON.parse(message);
                const oldDataOnAddingDate = storageData[addData.date] ? storageData[addData.date] : [];
                oldDataOnAddingDate.push({ name: addData.task, status: "doing" });
                storageData[addData.date] = oldDataOnAddingDate;
                fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                    event.reply('TaskItem:completeAdd', addData.task);
                })
            } catch (error) {
                console.log(error);
            }
        }

    })
})

// process change task item status to completed
ipcMain.on('TaskItem:complete', (event, message) => {
        fs.readFile(storageTasksPath, (err, data) => {
            if (!err) {
                try {
                    const storageData = JSON.parse(data);
                    const changingData = JSON.parse(message);
                    if (storageData[changingData.date]) {
                        const prevDataIndex = storageData[changingData.date].findIndex(taskItem => {
                            return taskItem.name === changingData.task;
                        })
                        if (prevDataIndex !== -1) {
                            const sendData = {
                                task: changingData.task,
                                oldStatus: storageData[changingData.date][prevDataIndex].status
                            }
                            storageData[changingData.date][prevDataIndex].status = "completed";
                            fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                                event.reply('TaskItem:completeChangeCompletedStatus', JSON.stringify(sendData));
                            })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

        })
    })
    // process change task item status to pausing
ipcMain.on('TaskItem:pause', (event, message) => {
        fs.readFile(storageTasksPath, (err, data) => {
            if (!err) {
                try {
                    const storageData = JSON.parse(data);
                    const changingData = JSON.parse(message);
                    if (storageData[changingData.date]) {
                        const prevDataIndex = storageData[changingData.date].findIndex(taskItem => {
                            return taskItem.name === changingData.task;
                        })
                        if (prevDataIndex !== -1) {
                            storageData[changingData.date][prevDataIndex].status = "paused";
                            fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                                event.reply('TaskItem:completeChangePausedStatus', changingData.task);
                            })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

        })
    })
    // process change task item status to continue
ipcMain.on('TaskItem:continue', (event, message) => {
        fs.readFile(storageTasksPath, (err, data) => {
            if (!err) {
                try {
                    const storageData = JSON.parse(data);
                    const changingData = JSON.parse(message);
                    if (storageData[changingData.date]) {
                        const prevDataIndex = storageData[changingData.date].findIndex(taskItem => {
                            return taskItem.name === changingData.task;
                        })
                        if (prevDataIndex !== -1) {
                            storageData[changingData.date][prevDataIndex].status = "doing";
                            fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                                event.reply('TaskItem:completeChangeContinuingStatus', changingData.task);
                            })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

        })
    })
    // process delete task item
ipcMain.on('TaskItem:delete', (event, message) => {
        fs.readFile(storageTasksPath, (err, data) => {
            if (!err) {
                try {
                    const storageData = JSON.parse(data);
                    const changingData = JSON.parse(message);
                    if (storageData[changingData.date]) {
                        const prevDataIndex = storageData[changingData.date].findIndex(taskItem => {
                            return taskItem.name === changingData.task;
                        })
                        if (prevDataIndex !== -1) {
                            const sendData = JSON.stringify({
                                task: changingData.task,
                                status: storageData[changingData.date][prevDataIndex].status
                            })
                            storageData[changingData.date].splice(prevDataIndex, 1)
                            fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                                event.reply('TaskItem:completDeleteTask', sendData);
                            })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

        })
    })
    // process reset progress of task items
ipcMain.on('TaskItem:reset', (event, date) => {
    fs.readFile(storageTasksPath, (err, data) => {
        if (!err) {
            try {
                const storageData = JSON.parse(data);
                if (storageData[date]) {
                    const newTaskItems = storageData[date].map(taskItem => {
                        return {...taskItem, status: "doing" };
                    })
                    storageData[date] = newTaskItems;
                    fs.writeFile(storageTasksPath, JSON.stringify(storageData), (err) => {
                        event.reply('TaskItems:reload', JSON.stringify(storageData[date]));
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }

    })
})


app.whenReady().then(createWindow)