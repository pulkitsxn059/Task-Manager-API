const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

// const msg = {
//     'to' : 'pulkitsxn059@gmail.com',
//     'from' : 'pulkitsxn059@gmail.com',
//     'subject' : 'Email From Send Grid',
//     'text' : 'This is the subject',
//     'html' : '<h1>HTML!!</h1>'
// }

// sgMail.send(msg)
const sendWelcomeEmail = ((email,name)=>{
    sgMail.send({
        'to' : email,
        'from' : 'pulkitsxn059@gmail.com',
        'subject' : 'Thanks for joining in!!',
        'text' : `Hello ${name}. Please do let us know how you get along with the app.` 
    })
})

const sendCancelationEmail = ((email,name)=>{
    sgMail.send({
        'to': email,
        'from' : 'pulkitsxn059@gmail.com',
        'subject' : 'Account Deleted',
        'text' : `Hello ${name}. Your Account has been successfully deleted. Please let us know what we could have done to keep you onboard.`
    })
})
module .exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}