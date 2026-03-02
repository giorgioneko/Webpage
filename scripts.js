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
