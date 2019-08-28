const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to: email,
        from: 'aman.maharj@gmail.com',
        subject: 'Welcome to the app',
        text: `Hello ${name}, thank you for joining this app`
    })
}

const sendByeEmail=(email,name)=>{
    sgMail.send({
        to: email,
        from: 'aman.maharj@gmail.com',
        subject: 'Sorry for loosing you',
        text:`hey ${name}, We are really sorry for loosing a valuable customer like you, Could you give us a feedback about this app. So we can improve`
    })
}

module.exports={
    sendWelcomeEmail,
    sendByeEmail
}