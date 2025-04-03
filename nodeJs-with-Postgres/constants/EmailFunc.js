import nodemailer from "nodemailer";
// Function to send OTP via email
const emailConfig = {
    service: "gmail",
    auth: {
        user: process.env.PORTAL_EMAIL,
        pass: process.env.PORTAL_PASSWORD,
    },
    secure: true,
};

export const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport(emailConfig);

        const mailOptions = {
            from: process.env.PORTAL_EMAIL,
            to: email,
            subject: "🔐 Email Verification - Secure Your Account",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Verify Your Account</h2>
                    <p>Dear user,</p>
                    <p>Your OTP for email verification is:</p>
                    <h3 style="background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px;">
                        <strong>${otp}</strong>
                    </h3>
                    <p>This OTP is valid for a limited time. If you did not request this, please ignore this email.</p>
                    <p>Best regards, <br/> Your Application Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return `✅ OTP has been sent successfully to ${email}`;
    } catch (error) {
        throw new Error(`❌ Failed to send OTP to ${email}: ${error.message}`);
    }
};