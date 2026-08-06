(function() {
    "use strict";

    // TARGET: November 11, 2026 (00:00:00)
    const TARGET_DATE = new Date(2026, 10, 11, 0, 0, 0); // monthIndex 10 = November

    // DOM elements
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Helper: pad with leading zero
    function pad(num) {
        return String(num).padStart(2, '0');
    }

    // Compute time difference and update DOM
    function updateCountdown() {
        const now = new Date();
        let diff = TARGET_DATE.getTime() - now.getTime();

        // If countdown is over, show zeros
        if (diff <= 0) {
            monthsEl.textContent = '00';
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // --- time constants ---
        const MS_PER_SECOND = 1000;
        const MS_PER_MINUTE = 60 * MS_PER_SECOND;
        const MS_PER_HOUR = 60 * MS_PER_MINUTE;
        const MS_PER_DAY = 24 * MS_PER_HOUR;
        const MS_PER_MONTH = 30.44 * MS_PER_DAY; // average month length

        let remaining = diff;

        const months = Math.floor(remaining / MS_PER_MONTH);
        remaining -= months * MS_PER_MONTH;

        const days = Math.floor(remaining / MS_PER_DAY);
        remaining -= days * MS_PER_DAY;

        const hours = Math.floor(remaining / MS_PER_HOUR);
        remaining -= hours * MS_PER_HOUR;

        const minutes = Math.floor(remaining / MS_PER_MINUTE);
        remaining -= minutes * MS_PER_MINUTE;

        const seconds = Math.floor(remaining / MS_PER_SECOND);

        // Update DOM
        monthsEl.textContent = pad(months);
        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    // Run once immediately, then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();