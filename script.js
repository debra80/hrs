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
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}-${day}-${year}`; // US date format
}

function renderEntries() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const months = {}; // Object to store entries grouped by month
    entries.forEach(entry => {
        const dateParts = entry.date.split('-');
        const monthYear = `${dateParts[0]}-${dateParts[2]}`;
        if (!months[monthYear]) {
            months[monthYear] = []; // Initialize array for the month if it doesn't exist
        }
        months[monthYear].push(entry);
    });
    Object.keys(months).sort().reverse().forEach(monthYear => {
        const monthEntries = months[monthYear];
        const monthCard = document.createElement('div');
        monthCard.classList.add('card');
        const [month, year] = monthYear.split('-');
        const monthName = new Date(`${month}-01-${year}`).toLocaleString('en-us', { month: 'long' });
        const monthTitle = document.createElement('h2');
        monthTitle.textContent = `${monthName} ${year}`; // Display month and year with month name
        monthCard.appendChild(monthTitle);
        monthEntries.forEach(entry => {
            const row = document.createElement('div');
            row.classList.add('entry');
            row.innerHTML = `
                <span>${entry.date}</span>
                <span>${entry.event}</span>
                <span>${entry.arriveTime}</span>
                <span>${entry.leaveTime}</span>
                <span>${entry.totalHours}</span>
            `;
            monthCard.appendChild(row);
        });
        entriesList.appendChild(monthCard);
    });
}

window.addEventListener('load', () => {
    // Fill in default date
    const currentDate = getCurrentDate();
    const [month, day, year] = currentDate.split('-');
    document.getElementById('month').value = month;
    document.getElementById('day').value = day;
    document.getElementById('year').value = year;

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

    const event = document.getElementById('event').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const year = document.getElementById('year').value;
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const ampm = document.getElementById('ampm').value;
    const endHour = document.getElementById('endHour').value;
    const endMinute = document.getElementById('endMinute').value;
    const endAmpm = document.getElementById('endAmpm').value;
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;

    const arriveTime = `${hour}:${minute} ${ampm}`;
    const leaveTime = `${endHour}:${endMinute} ${endAmpm}`;

    const totalHours = calculateTotalHours(arriveTime, leaveTime) * numPeople;

    const entry = {
        date: `${month}-${day}-${year}`,
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
    // For example:
    const startTime = new Date('2000-01-01 ' + arriveTime);
    const endTime = new Date('2000-01-01 ' + leaveTime);
    const diff = endTime - startTime;
    const totalHours = diff / 1000 / 60 / 60;
    return totalHours;
}

function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}
