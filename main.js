const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const DataAccessObject = require('./dao');
const dao = new DataAccessObject("./data.json");
var nodemailer = require('nodemailer');

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: "ToDoList",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile('index.html')

}

ipcMain.on('store-data', (event, data) => {
    dao.data = data;
    dao.writeData();
})

ipcMain.on("did-finish-load", async e => {
    let data = await dao.readData();
    e.sender.send("onload-data", data);
})

ipcMain.on("send-email", async e => {
    let data = dao.data;
    const getToday = () => {

        let currentdate = new Date();
        let datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) +
            "/" + currentdate.getFullYear();
        return datetime;
    }
    const convertArrayToString = (arrayData) => {
        let rs = "";
        arrayData.forEach(element => {
            rs = rs + "\n\t- " + element;
        });
        return rs;
    }

    const plainToday = convertArrayToString(data.listItem) + convertArrayToString(data.doing) + convertArrayToString(data.completed)



    var context_email =
        'Phạm Thành Đạt báo cáo ngày ' + getToday() + '\n' +
        ' Plain Today: \n' + plainToday + '\n' +
        'Doing: \n' + convertArrayToString(data.doing) + '\n' +
        'Completed: \n' + convertArrayToString(data.completed);


    var sub = 'Báo cáo ngày' + getToday();

    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'user@gmail.com',
            pass: '****'
        }
    });

    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Pham Thanh Dat',
        to: 'datpt063@gmail.com',
        subject: sub,
        text: context_email,

    }
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
})

app.whenReady().then(createWindow)