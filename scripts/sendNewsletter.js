const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const Parser = require('rss-parser');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const rssParser = new Parser();

async function run() {
    try {
        console.log("Searching the internet for new cat game news this week...");

        // Use Google News RSS to search the internet for articles from the last 7 days (when:7d)
        const searchQuery = encodeURIComponent('new cat game release OR announced when:7d');
        const rssUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;

        const feed = await rssParser.parseURL(rssUrl);
        const articles = feed.items.slice(0, 5); // Take top 5 recent news hits

        if (articles.length === 0) {
            console.log("No new cat game news found on the internet this week. Skipping email.");
            return;
        }

        console.log(`Found ${articles.length} news articles about new cat games!`);

        // Fetch subscribers from Supabase database
        console.log("Fetching subscribers from Supabase...");
        const { data: subscribers, error } = await supabase
            .from('subscribers')
            .select('email');

        if (error) throw error;
        if (!subscribers || subscribers.length === 0) {
            console.log("No subscribers found in database. Skipping email.");
            return;
        }

        const emails = subscribers.map(sub => sub.email);
        console.log(`Sending newsletter to ${emails.length} subscribers via Gmail...`);

        // Format email HTML
        let newsHtml = articles.map(article => `
      <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.05);">
        <h3 style="margin-top: 0; font-size: 18px;">
          <a href="${article.link}" style="color: #ff719a; text-decoration: none;">📰 ${article.title}</a>
        </h3>
        <p style="font-size: 14px; color: #555;"><strong>Date Source:</strong> ${new Date(article.pubDate).toLocaleDateString()}</p>
        <p style="font-size: 15px;">${article.contentSnippet || 'Read more about this release at the link above.'}</p>
      </div>
    `).join('');

        const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #ff719a;">🐱 Weekly Cat Games radar</h1>
        <p>Happy Friday! We scoured the internet for the most recent news about cat games released or announced this week:</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        ${newsHtml}
        <br/>
        <p style="font-size: 12px; color: #888; text-align: center;">You are receiving this because you subscribed on Neko Page.</p>
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

        // Send the email (BCC all subscribers to protect their privacy)
        const info = await transporter.sendMail({
            from: `"Neko Page" <${GMAIL_USER}>`,
            bcc: emails,
            subject: '🐾 This Week\'s New Cat Games News!',
            html: htmlContent
        });

        console.log("✅ Weekly newsletter sent successfully via Gmail!", info.messageId);

    } catch (error) {
        console.error("❌ Error running newsletter script:", error);
        process.exit(1);
    }
}

run();
