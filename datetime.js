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
currentDate();

function processTask() {
    var completed = document.querySelector(".completed");
    var paused = document.querySelector(".paused");
    completed.style.width = "40%";
    paused.style.width = "30%";
}

$(document).ready(function() {
    $(".toggle").click(function() {
        $(".panel").slideToggle();
    });
});
processTask();