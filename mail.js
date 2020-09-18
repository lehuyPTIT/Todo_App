const nodemailer = require("nodemailer");
var showToast = require("show-toast");

document.getElementById('Subjectsender').value=`[TRAINING_JS_NODEJS] Daily report${new Date().getDate()}/${new Date().getMonth()+1}`;
document.getElementById('textarea').value=`
Em Lê Văn Huy  báo cáo tiến độ ngày ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}
1. Plan today:Hoàn thiện Todo list
2. Actual today:TodoList:100%
3. issue:No`

document.getElementById('submitbutton').addEventListener('click', (e)=>{
    e.preventDefault();
    let subject=document.getElementById('Subjectsender').value;
    let content=document.getElementById('textarea').value;
    let Tosender=document.getElementById('Tosender').value;
    //config
    var transporter =  nodemailer.createTransport({ 
        host:"smtp.gmail.com",
        service: 'Gmail',
        auth: {
            user:'huyhuys297@gmail.com',
            pass:'anhhuyyh1'
        }
    });

    var mainOptions = { 
        from: 'Lê Huy',
        to: Tosender,
        subject: subject,
        text: `You recieved message from Lê Huy `,
        html:content
    }
    showToast('Xin vui lòng đợi trong giây lát');
    transporter.sendMail(mainOptions, (err,infor)=>{
        if(err){
            console.log(err)
            showToast('có lỗi xảy ra');

        }
        else{
            showToast('Đã  gửi mail thành công');

        }

    });
    

})