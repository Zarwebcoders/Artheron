const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Define message
    const message = {
        from: `${process.env.FROM_NAME || 'Artheron Ecosystem'} <${process.env.FROM_EMAIL || 'no-reply@artheron.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // Send email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
