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
        const monthName = new Date(`${year}-${month}-01`).toLocaleString('en-us', { month: 'long' });
        const monthTitle = document.createElement('h2');
        monthTitle.textContent = `${monthName} ${year}`; // Display month and year with month name
        monthCard.appendChild(monthTitle);
        monthEntries.forEach(entry => {
            const row = document.createElement('div');
            row.classList.add('entry');

            // Create day icon
            const dayIcon = document.createElement('div');
            dayIcon.classList.add('day-icon');
            dayIcon.textContent = entry.date.split('-')[1];
            row.appendChild(dayIcon);

            // Create content
            const content = document.createElement('div');
            content.classList.add('entry-content');
            content.innerHTML = `
                <span>${entry.event}</span><br>
                <div id="details">
                <label for="month"><i class="material-icons">schedule</i></label><span class="detail">${entry.arriveTime} - ${entry.leaveTime}</span>
                <label for="month"><i class="material-icons">people</i></label><span class="detail">${entry.numPeople}</span>
                <label for="month"><i class="material-symbols-outlined">equal</i></label><span class="detail">${entry.totalHours} hours</span>
                </div>
            `;
            row.appendChild(content);

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="material-icons">close</i>';
            deleteButton.addEventListener('click', () => deleteEntry(entries.indexOf(entry)));
            row.appendChild(deleteButton);

            monthCard.appendChild(row);
        });
        entriesList.appendChild(monthCard);
    });
}

window.addEventListener('load', () => {
    try {
        // Fill in default date
        const currentDate = getCurrentDate();
        const [month, day, year] = currentDate.split('-');
        document.getElementById('month').value = month;
        document.getElementById('day').value = day;
        document.getElementById('year').value = year;

        renderEntries();
    } catch (error) {
        logToConsole('Error rendering entries: ' + error);
    }
});

// Adjust settings modal visibility
document.addEventListener('DOMContentLoaded', function() {
    try {
        const settingsModal = document.getElementById('settingsModal');
        const settingsBtn = document.getElementById('settingsBtn');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn'); // New reset button
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

        resetBtn.addEventListener('click', () => {
            const confirmation = confirm("Warning: This cannot be undone! Are you sure you would like to reset?");
            if (confirmation) {
                localStorage.removeItem('entries');
                renderEntries();
            }
        });
    } catch (error) {
        logToConsole('Error setting up settings UI: ' + error);
    }
});

const entryForm = document.getElementById('entryForm');

entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
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

        const totalHours = calculateTotalHours(arriveTime, leaveTime, `${month}-${day}-${year}`) * numPeople;

        const entry = {
            date: `${month}-${day}-${year}`,
            event,
            arriveTime,
            leaveTime,
            numPeople,
            totalHours
        };

        saveEntry(entry);
        renderEntries();
        entryForm.reset();

        // Reset date to today's date
        const currentDate = getCurrentDate();
        const [currentMonth, currentDay, currentYear] = currentDate.split('-');
        document.getElementById('month').value = currentMonth;
        document.getElementById('day').value = currentDay;
        document.getElementById('year').value = currentYear;
    } catch (error) {
        logToConsole('Error saving entry: ' + error);
    }
});

function calculateTotalHours(arriveTime, leaveTime, date) {
    try {
        console.log('Arrive Time:', arriveTime);
        console.log('Leave Time:', leaveTime);
        console.log('Date:', date);

        const startTime = new Date(`${date} ${arriveTime}`);
        const endTime = new Date(`${date} ${leaveTime}`);

        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        const diff = endTime - startTime;
        console.log('Difference in milliseconds:', diff);

        const totalHours = diff / (1000 * 60 * 60);
        console.log('Total Hours:', totalHours);

        return totalHours;
    } catch (error) {
        console.error('Error calculating total hours:', error);
        return null; // Return null if an error occurs
    }
}

function parseCustomDate(dateString, timeString) {
    const [year, month, day] = dateString.split('-');
    const [hours, minutes] = timeString.split(':');
    return new Date(year, month - 1, day, hours, minutes);
}

function saveEntry(entry) {
    try {
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        logToConsole('Entry saved: ' + JSON.stringify(entry)); // Log the saved entry
    } catch (error) {
        logToConsole('Error saving entry to localStorage: ' + error);
    }
}

function deleteEntry(index) {
    const confirmation = confirm("Are you sure you want to delete this entry?");
    if (confirmation) {
        try {
            let entries = JSON.parse(localStorage.getItem('entries')) || [];
            entries.splice(index, 1); // Remove the entry at the specified index
            localStorage.setItem('entries', JSON.stringify(entries));
            renderEntries();
        } catch (error) {
            logToConsole('Error deleting entry from localStorage: ' + error);
        }
    }
}

function logToConsole(message) {
    const consoleLog = document.getElementById('consoleLog');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    consoleLog.appendChild(logEntry);
}

// Log initial settings
logToConsole('Initial settings: ' + JSON.stringify(settings));
