// script.js

// Check if settings are stored in local storage
let settings = localStorage.getItem('settings');
if (!settings) {
    settings = { apiKey: '' }; // Default settings
} else {
    settings = JSON.parse(settings);
}

const main = document.getElementById('main');
const settingsPanel = document.getElementById('settingsPanel');
const settingsBtn = document.getElementById('settingsBtn');
const saveBtn = document.getElementById('saveBtn');

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('show-panel');
});

saveBtn.addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    settings.apiKey = apiKey;
    localStorage.setItem('settings', JSON.stringify(settings));
    settingsPanel.classList.remove('show-panel');
});

function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

function renderEntries() {
    main.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(entry => {
        const row = document.createElement('div');
        row.classList.add('entry');
        row.innerHTML = `
            <span>${entry.date}</span>
            <span>${entry.event}</span>
            <span>${entry.arriveTime}</span>
            <span>${entry.leaveTime}</span>
            <span>${entry.totalHours}</span>
        `;
        main.appendChild(row);
    });
}

entryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const event = document.getElementById('event').value;
    const arriveTime = document.getElementById('arriveTime').value;
    const leaveTime = document.getElementById('leaveTime').value;
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;

    const totalHours = calculateTotalHours(arriveTime, leaveTime) * numPeople;

    const entry = {
        date,
        event,
        arriveTime,
        leaveTime,
        totalHours
    };

    saveEntry(entry);
    renderEntries();
    entryForm.reset();
});

function calculateTotalHours(arriveTime, leaveTime) {
    // Calculate total hours here
}

function saveEntry(entry) {
    // Save entry to local storage
}

function renderEntries() {
    // Render entries in the UI
}
