const nodemailer = require('nodemailer');

const sendEmail = async options =>{
const transporter = nodemailer.createTransport({
   //1.Create a transporter
    // service:'Gmail'
    host : process.env.EMAIL_HOST,
    PORT : process.env.EMAIL_PORT,
    auth :{
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
    //Activate in gmail "less secure app" option
})
    //2.Define the email options
   const mailOptions = {
    from : " Nizar miri <nizo.miri@hotmail.co.uk>",
    to : options.email,
    subject : options.subject,
    text : options.message
    //html:
   }
    //3.Actually send the email
    await transporter.sendMail(mailOptions)
}
module.exports =sendEmail