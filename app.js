
"use strict";

/* =========================================
   QUOTEX AI FUTURE
   DEMO SIGNAL GENERATOR
========================================= */


/* =========================================
   ASSET DATABASE
========================================= */

const assets = {

    currency: [
        "USD/BRL (OTC)",
        "USD/ARS (OTC)",
        "USD/PKR (OTC)",
        "AUD/NZD (OTC)",
        "EUR/JPY",
        "USD/NGN (OTC)",
        "CAD/CHF (OTC)",
        "EUR/USD",
        "NZD/JPY (OTC)",
        "NZD/CAD (OTC)",
        "USD/BDT (OTC)",
        "USD/MXN (OTC)",
        "EUR/GBP",
        "AUD/JPY",
        "CAD/JPY",
        "USD/PHP (OTC)",
        "AUD/USD",
        "GBP/JPY",
        "USD/JPY",
        "GBP/USD",
        "GBP/AUD",
        "AUD/CAD",
        "EUR/AUD",
        "USD/CHF",
        "USD/DZD (OTC)",
        "AUD/CHF",
        "EUR/CAD",
        "CHF/JPY",
        "GBP/CAD",
        "NZD/CHF (OTC)",
        "USD/COP (OTC)",
        "USD/IDR (OTC)",
        "USD/CAD",
        "USD/ZAR (OTC)",
        "GBP/CHF",
        "EUR/NZD (OTC)",
        "EUR/CHF",
        "GBP/NZD (OTC)",
        "NZD/USD (OTC)"
    ],

    crypto: [
        "Avalanche (OTC)",
        "Bitcoin (OTC)",
        "Ethereum (OTC)",
        "Litecoin (OTC)",
        "Toncoin (OTC)",
        "Trump (OTC)",
        "Zcash (OTC)",
        "Dash (OTC)",
        "Axie Infinity (OTC)",
        "Polkadot (OTC)"
    ],

    commodities: [
        "USCrude (OTC)",
        "UKBrent (OTC)",
        "Silver",
        "Gold"
    ]

};


/* =========================================
   DOM ELEMENTS
========================================= */

const loginPage = document.getElementById("login-page");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

const assetList = document.getElementById("asset-list");
const assetSearch = document.getElementById("asset-search");

const categoryButtons = document.querySelectorAll(".category-btn");

const signalCountSelect = document.getElementById("signal-count");
const timeWindowSelect = document.getElementById("time-window");

const generateBtn = document.getElementById("generate-btn");
const signalList = document.getElementById("signal-list");

const copyAllBtn = document.getElementById("copy-all-btn");

const totalSignals = document.getElementById("total-signals");
const selectedCount = document.getElementById("selected-count");


/* =========================================
   APPLICATION STATE
========================================= */

let currentCategory = "currency";

let selectedAssets = new Set();

let generatedSignals = [];


/* =========================================
   DEMO LOGIN
========================================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    // Frontend-only demo login.
    // This does not authenticate a real account.

    loginPage.classList.add("hidden");

    dashboard.classList.remove("hidden");

    renderAssets();

});


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener("click", function () {

    dashboard.classList.add("hidden");

    loginPage.classList.remove("hidden");

});


/* =========================================
   CATEGORY SWITCHING
========================================= */

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        categoryButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

        assetSearch.value = "";

        renderAssets();

    });

});


/* =========================================
   ASSET RENDERING
========================================= */

function renderAssets() {

    const searchText = assetSearch.value
        .trim()
        .toLowerCase();

    const categoryAssets = assets[currentCategory];

    const filteredAssets = categoryAssets.filter(function (asset) {

        return asset.toLowerCase().includes(searchText);

    });

    assetList.innerHTML = "";

    if (filteredAssets.length === 0) {

        assetList.innerHTML = `
            <div class="empty-state">
                <h3>No Assets Found</h3>
                <p>Try searching another asset.</p>
            </div>
        `;

        return;

    }

    filteredAssets.forEach(function (asset) {

        const item = document.createElement("div");

        item.className = "asset-item";

        if (selectedAssets.has(asset)) {
            item.classList.add("selected");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "asset-checkbox";

        checkbox.checked = selectedAssets.has(asset);

        const name = document.createElement("span");

        name.className = "asset-name";

        name.textContent = asset;

        item.appendChild(checkbox);

        item.appendChild(name);

        function toggleAsset() {

            if (selectedAssets.has(asset)) {

                selectedAssets.delete(asset);

            } else {

                selectedAssets.add(asset);

            }

            renderAssets();

            updateSelectedCount();

        }

        item.addEventListener("click", function (event) {

            if (event.target !== checkbox) {
                toggleAsset();
            }

        });

        checkbox.addEventListener("change", function () {

            toggleAsset();

        });

        assetList.appendChild(item);

    });

    updateSelectedCount();

}


/* =========================================
   ASSET SEARCH
========================================= */

assetSearch.addEventListener("input", function () {

    renderAssets();

});


/* =========================================
   SELECTED ASSET COUNT
========================================= */

function updateSelectedCount() {

    selectedCount.textContent = String(
        selectedAssets.size
    ).padStart(2, "0");

}


/* =========================================
   TIMEZONE HELPERS
========================================= */

function getDhakaDate() {

    return new Intl.DateTimeFormat("en-GB", {

        timeZone: "Asia/Dhaka",

        day: "2-digit",

        month: "2-digit",

        year: "numeric"

    }).format(new Date());

}


function getDhakaTime(date) {

    return new Intl.DateTimeFormat("en-GB", {

        timeZone: "Asia/Dhaka",

        hour: "2-digit",

        minute: "2-digit",

        hour12: false

    }).format(date);

}


function getDhakaCurrentMinute() {

    const parts = new Intl.DateTimeFormat("en-GB", {

        timeZone: "Asia/Dhaka",

        hour: "2-digit",

        minute: "2-digit",

        hour12: false

    }).formatToParts(new Date());

    const hour = Number(
        parts.find(part => part.type === "hour").value
    );

    const minute = Number(
        parts.find(part => part.type === "minute").value
    );

    return hour * 60 + minute;

}


function formatMinute(totalMinutes) {

    const normalized = (
        totalMinutes % 1440 + 1440
    ) % 1440;

    const hours = Math.floor(normalized / 60);

    const minutes = normalized % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0")
    );

}


/* =========================================
   RANDOM HELPER
========================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function shuffleArray(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];

    }

    return shuffled;

}


/* =========================================
   ASSET FORMAT
========================================= */

function formatAsset(asset) {

    let formatted = asset
        .replace(/\s*\(OTC\)/gi, "")
        .replace(/\s+/g, "")
        .replace(/\//g, "");

    return formatted + "-OTC";

}


/* =========================================
   SIGNAL GENERATOR
========================================= */

generateBtn.addEventListener("click", function () {

    if (selectedAssets.size === 0) {

        alert("Please select at least one asset.");

        return;

    }

    const requestedCount = Number(
        signalCountSelect.value
    );

    const windowMinutes = Number(
        timeWindowSelect.value
    );

    if (requestedCount > windowMinutes) {

        alert(
            "Signal count cannot exceed the available minute slots."
        );

        return;

    }

    generateBtn.disabled = true;

    generateBtn.textContent = "Generating Signals...";

    setTimeout(function () {

        createSignals(
            requestedCount,
            windowMinutes
        );

        generateBtn.disabled = false;

        generateBtn.innerHTML = `
            <span>✦</span>
            Generate Signals
        `;

    }, 450);

});


/* =========================================
   CREATE SIGNALS
========================================= */

function createSignals(count, windowMinutes) {

    const selectedArray = Array.from(selectedAssets);

    const currentMinute = getDhakaCurrentMinute();

    const availableMinutes = [];

    for (let i = 1; i <= windowMinutes; i++) {

        availableMinutes.push(
            currentMinute + i
        );

    }

    const randomTimes = shuffleArray(
        availableMinutes
    ).slice(0, count);

    randomTimes.sort(function (a, b) {
        return a - b;
    });

    generatedSignals = [];

    randomTimes.forEach(function (minute, index) {

        const asset = selectedArray[
            randomNumber(0, selectedArray.length - 1)
        ];

        const direction = Math.random() < 0.5
            ? "CALL"
            : "PUT";

        generatedSignals.push({

            id: index + 1,

            time: formatMinute(minute),

            asset: asset,

            formattedAsset: formatAsset(asset),

            direction: direction,

            duration: "M1"

        });

    });

    renderSignals();

}


/* =========================================
   SIGNAL TEXT FORMAT
========================================= */

function buildSignalText(signal) {

    return (
        signal.time +
        " " +
        signal.formattedAsset +
        " M1 " +
        signal.direction
    );

}


function buildAllSignalsText() {

    if (generatedSignals.length === 0) {
        return "";
    }

    const header = [

        "🌐 TIMEZONE : UTC+06:00 🇧🇩",

        "🗓 DATE : " + getDhakaDate(),

        "➡️ TRADE DURATION : M1",

        "",

        "┏━━━❰⭐️ QUOTEX AI ⭐️❱━━━┓"

    ];

    const signalLines = generatedSignals.map(
        buildSignalText
    );

    const footer = [

        "┗━━━❰⭐️ QUOTEX AI ⭐️❱━━━┛",

        "",

        "⚠️ RISK MANAGEMENT",


        "• Avoid emotional trading",

        "• Avoid weak market conditions",

        "• Don't go against momentum",


        "",

        "Feedback 24/7 Chat",

        "@trader_rifat_132"

    ];

    return [

        ...header,

        ...signalLines,

        ...footer

    ].join("\n");

}


/* =========================================
   RENDER SIGNAL LIST
========================================= */

function renderSignals() {

    signalList.innerHTML = "";

    totalSignals.textContent = String(
        generatedSignals.length
    ).padStart(2, "0");

    if (generatedSignals.length === 0) {

        signalList.innerHTML = `
            <div class="empty-state">
                <h3>No Signals Generated</h3>
                <p>Select assets and generate signals.</p>
            </div>
        `;

        return;

    }

    generatedSignals.forEach(function (signal) {

        const row = document.createElement("div");

        row.className = "signal-row";

        const details = document.createElement("div");

        details.className = "signal-details";

        const time = document.createElement("span");

        time.className = "signal-time";

        time.textContent = signal.time;

        const asset = document.createElement("span");

        asset.className = "signal-asset";

        asset.textContent = signal.formattedAsset;

        const direction = document.createElement("span");

        direction.className =
            signal.direction === "CALL"
                ? "signal-direction call"
                : "signal-direction put";

        direction.textContent = signal.direction;

        const copyButton = document.createElement("button");

        copyButton.className = "copy-btn";

        copyButton.textContent = "Copy";

        copyButton.addEventListener("click", async function () {

            await copyText(
                buildSignalText(signal)
            );

        });

        details.appendChild(time);

        details.appendChild(asset);

        details.appendChild(direction);

        row.appendChild(details);

        row.appendChild(copyButton);

        signalList.appendChild(row);

    });

}


/* =========================================
   COPY SYSTEM
========================================= */

async function copyText(text) {

    if (!text) {

        alert("Nothing to copy.");

        return;

    }

    try {

        await navigator.clipboard.writeText(text);

        alert("Copied successfully!");

    } catch (error) {

        const textarea = document.createElement("textarea");

        textarea.value = text;

        textarea.style.position = "fixed";

        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        alert("Copied successfully!");

    }

}


/* =========================================
   COPY ALL SIGNALS
========================================= */

copyAllBtn.addEventListener("click", function () {

    const text = buildAllSignalsText();

    if (!text) {

        alert("Generate signals first.");

        return;

    }

    copyText(text);

});


/* =========================================
   INITIALIZATION
========================================= */

renderAssets();

updateSelectedCount();

console.log(
    "QUOTEX AI FUTURE Demo System Initialized"
);
