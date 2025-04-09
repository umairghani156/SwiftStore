import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailConfig = {
    service: "gmail",
    auth: {
        user: process.env.PORTAL_EMAIL,
        pass: process.env.PORTAL_PASSWORD,
    },
    secure: true,
};

async function sendEmailNotification(mail, msg, title) { 
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
        from: process.env.portal_email,
        to: mail,  
        subject: title,
        html: `
       <html>
    <body style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ddd; position: relative;">
        <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN5XaPknTWTxdBcdC3r0_9blSi_8n3rD_2Xg&s" 
            alt="Logo" 
            style="position: absolute; top: 20px; right: 20px; width: 100px; height: auto;"
        />
        <div style="width: 100%;">
            <h3 style="color: #333;">${title}</h3>
            <p style="font-size: 16px; color: #555;">${msg}</p>
        </div>
        <p style="font-size: 16px; color: #555; width: 100%;">
        If you have any questions or need further information, please do not hesitate to inform us.
        </p>
        <footer style="margin-top: 20px; font-size: 12px; color: #999;">
            <p>Best regards,</p>
            <p>Saylani Mass IT</p>
        </footer>
    </body>
</html>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        return `Message sent to ${mail} via email`;
    } catch (error) {
        throw `Error sending OTP to ${mail} via email: ${error}`;
    }
}

export {sendEmailNotification}
