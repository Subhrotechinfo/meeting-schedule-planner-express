const nodemailer = require('nodemailer');
 module.exports.sendEmail = async (emailId, link)=>{
    let transporter =  nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:'465',
        secure:true,
        auth:{
            user:'*************@gmail.com',
            pass:'************'
        }
    });

    let info = await transporter.sendMail({
        to:emailId,
        subject:'Hello User',
        text:'Hello User',
        html:'<p>Click here</p>'+`<p> ${link} </p>`
    })
    console.log('EMail send');

}

