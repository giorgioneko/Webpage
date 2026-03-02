// Google Apps Script to send a welcome email
// 1. Go to script.google.com
// 2. Paste this code
// 3. Click Deploy -> New Deployment -> Type: Web App
// 4. "Execute as: Me" and "Who has access: Anyone"
// 5. Copy the Web App URL and paste it into scripts.js!

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        var email = data.email;

        var subject = "🐾 Welcome to the Neko Page Newsletter!";
        var body = "Hi there!\n\nYou have successfully subscribed to the Neko Page weekly cat games newsletter.\nEvery Friday, you'll receive a curated email with the latest news about freshly announced and released cat games!\n\nStay pawsome,\nThe Neko Page Team";

        // This securely uses your Gmail account behind the scenes to send the email!
        MailApp.sendEmail(email, subject, body);

        return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Needed to handle CORS preflight requests from the browser
function doOptions(e) {
    var headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
    };
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
}
