const mailer = require("nodemailer")

const transport = mailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})
const sendMail = async(to,subject,message)=>{
   return transport.sendMail({
    from:`"Nodemailer"<${process.env.Email_user}>`,
    to ,
    subject,
    html:message
   })
};
module.exports = sendMail