// script.js

// Check if settings are stored in local storage
let settings = localStorage.getItem('settings');
if (!settings) {
    settings = { apiKey: '' }; // Default settings
} else {
    settings = JSON.parse(settings);
}

const main = document.getElementById('main');

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function renderEntries() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
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
        entriesList.appendChild(row);
    });
}

window.addEventListener('load', () => {
    renderEntries();
});

// Adjust settings modal visibility
document.addEventListener('DOMContentLoaded', function() {
    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const saveBtn = document.getElementById('saveBtn');
    const closeBtn = document.getElementsByClassName('close')[0];

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    saveBtn.addEventListener('click', () => {
        const apiKey = document.getElementById('apiKey').value;
        settings.apiKey = apiKey;
        localStorage.setItem('settings', JSON.stringify(settings));
        settingsModal.style.display = 'none';
    });
});

const entryForm = document.getElementById('entryForm');

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
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}
