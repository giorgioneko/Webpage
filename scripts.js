/* Place your JavaScript in this file */

const storeDomains = [
    "store.steampowered.com/app/",
    "store.playstation.com/en-us/concept/",
    "www.nintendo.com/store/products/",
    "www.xbox.com/en-US/games/store/",
    "store.epicgames.com/en-US/p/",
    "www.gog.com/en/game/",
    "itch.io",
    "play.google.com/store/apps/details?id=",
    "apps.apple.com/us/app/",
    "www.crazygames.com/game/",
    "poki.com/en/g/"
];

const catKeywords = ["cat", "cats", "kitty", "kitten", "feline", "meow"];

function openRandomCatGame() {
    const btn = document.querySelector('.btn-game');
    const originalText = btn.innerHTML;
    btn.innerHTML = '🐾 Traveling to a random universe...';

    // 1. Randomly select a storefront domain to search within
    const domain = storeDomains[Math.floor(Math.random() * storeDomains.length)];

    // 2. Randomly select a cat-related search keyword
    const keyword = catKeywords[Math.floor(Math.random() * catKeywords.length)];

    // 3. Build a DuckDuckGo "I'm Feeling Lucky" search URL.
    // The '!ducky' bang triggers an instant redirect to the first search result,
    // avoiding Google's annoying "Redirect Notice" warning screens.
    const searchQuery = `!ducky site:${domain} ${keyword} game`;
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;

    // Briefly show the animation then blast off!
    setTimeout(() => {
        btn.innerHTML = originalText;
        window.open(searchUrl, '_blank');
    }, 400);
}

// -----------------------------------------
// NEWSLETTER SUBSCRIPTION LOGIC
// -----------------------------------------

// Supabase project URL and anon public key for frontend subscription
const SUPABASE_URL = "https://fympyfzeceommprgkyin.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_N3g9nc6jzD5xQYlsRygwSw_g_OAYxbr";

async function handleSubscribe(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = document.getElementById('email-input');
    const messageEl = document.getElementById('subscribe-message');
    const btn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Subscribing...';
    btn.disabled = true;

    try {
        // Prevent real request if placeholders are still present
        if (SUPABASE_URL === "YOUR_SUPABASE_URL") {
            throw new Error("SUPABASE_KEYS_MISSING");
        }

        // POST the email to the Supabase REST API (subscribers table)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            // Check if duplicate
            const errResponse = await response.json();
            if (errResponse.code === '23505') {
                throw new Error("ALREADY_SUBSCRIBED");
            }
            throw new Error('API_ERROR');
        }

        // Success UI handling
        messageEl.style.color = "#238636"; // Green
        messageEl.textContent = "Successfully subscribed to the weekly cat games newsletter!";
        emailInput.value = '';
        btn.innerHTML = 'Subscribed!';
        btn.classList.add('btn-success');

    } catch (error) {
        messageEl.style.color = "var(--accent-1)"; // Pink/red error color

        if (error.message === "SUPABASE_KEYS_MISSING") {
            messageEl.textContent = "Setup required: Please enter your Supabase keys in scripts.js.";
        } else if (error.message === "ALREADY_SUBSCRIBED") {
            messageEl.textContent = "This email is already subscribed!";
        } else {
            messageEl.textContent = "Failed to subscribe. Please try again later.";
        }
        btn.innerHTML = originalText;
    } finally {
        btn.disabled = false;
    }
}
