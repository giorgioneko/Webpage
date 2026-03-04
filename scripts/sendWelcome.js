const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const TARGET_EMAIL = process.env.TARGET_EMAIL;

async function run() {
    try {
        if (!TARGET_EMAIL) {
            console.log("No recipient email provided via payload.");
            return;
        }

        console.log(`Sending welcome email to ${TARGET_EMAIL} via Gmail...`);

        const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333 text-align: center;">
        <h1 style="color: #ff719a;">🐾 Welcome to the Neko Page!</h1>
        <p>Hi there!</p>
        <p>You have successfully subscribed to the Neko Page weekly cat games newsletter.</p>
        <p>Every Friday at 12:00 PM UTC, you'll receive a curated email with the latest news about freshly announced and released cat games!</p>
        <br/>
        <p>Stay pawsome,<br/><strong>The Neko Page Team</strong></p>
      </div>
    `;

        // Configure Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD
            }
        });

        // Send the email
        const info = await transporter.sendMail({
            from: `"Neko Page" <${GMAIL_USER}>`,
            to: TARGET_EMAIL,
            subject: '🐾 Welcome to the Newsletter!',
            html: htmlContent
        });

        console.log("✅ Welcome email sent successfully!", info.messageId);

    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        process.exit(1);
    }
}

run();
