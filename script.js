(function() {
    "use strict";

    // TARGET: November 11, 2026 (00:00:00)
    const TARGET_DATE = new Date(2026, 10, 11, 0, 0, 0);

    // DOM elements
    const monthsEl  = document.getElementById('months');
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const tickSound = document.getElementById('tickSound');
    const doomCard  = document.querySelector('.doom-card');
    const separators = document.querySelectorAll('.separator');
    const allNumbers = [monthsEl, daysEl, hoursEl, minutesEl, secondsEl];

    function pad(num) {
        return String(num).padStart(2, '0');
    }

    function playTick() {
        if (!tickSound) return;
        tickSound.currentTime = 0;
        tickSound.volume = 0.2;
        tickSound.play().catch(() => {});
    }

    let audioUnlocked = false;
    document.addEventListener('click', function unlockAudio() {
        if (!audioUnlocked) {
            playTick();
            audioUnlocked = true;
        }
    });

    // ---------- GLITCH HELPERS ----------
    function glitchNumber(el) {
        if (!el) return;
        el.setAttribute('data-text', el.textContent);
        el.classList.add('glitch');

        // also a quick flash overlay
        el.classList.add('glitch-flash');

        setTimeout(() => {
            el.classList.remove('glitch');
            el.classList.remove('glitch-flash');
        }, 300);
    }

    function glitchLabel(labelEl) {
        if (!labelEl) return;
        labelEl.classList.add('glitch-label');
        setTimeout(() => labelEl.classList.remove('glitch-label'), 200);
    }

    function glitchSeparators() {
        separators.forEach(sep => {
            sep.classList.add('glitch-sep');
            setTimeout(() => sep.classList.remove('glitch-sep'), 200);
        });
    }

    function glitchScreen() {
        if (!doomCard) return;
        doomCard.classList.add('glitch-screen');
        setTimeout(() => doomCard.classList.remove('glitch-screen'), 200);
    }

    // Randomly pick a number & label to glitch
    function randomGlitch() {
        const idx = Math.floor(Math.random() * allNumbers.length);
        const numEl = allNumbers[idx];
        glitchNumber(numEl);

        const labelEl = numEl && numEl.parentElement
            ? numEl.parentElement.querySelector('.label')
            : null;
        glitchLabel(labelEl);
    }

    // Schedule random glitches
    function scheduleGlitch() {
        const delay = 1500 + Math.random() * 4000; // 1.5s – 5.5s
        setTimeout(() => {
            randomGlitch();

            // sometimes a bigger glitch (screen + separators)
            if (Math.random() < 0.3) {
                glitchScreen();
                glitchSeparators();
            }

            scheduleGlitch();
        }, delay);
    }

    // ---------- CALENDAR BREAKDOWN (Option B) ----------
    function getCalendarBreakdown(from, to) {
        let months = 0;
        let cursor = new Date(from.getTime());

        while (true) {
            const next = new Date(cursor.getTime());
            next.setMonth(next.getMonth() + 1);

            if (next <= to) {
                months++;
                cursor = next;
            } else {
                break;
            }
        }

        let remaining = to.getTime() - cursor.getTime();

        const MS_PER_SECOND = 1000;
        const MS_PER_MINUTE = 60 * MS_PER_SECOND;
        const MS_PER_HOUR   = 60 * MS_PER_MINUTE;
        const MS_PER_DAY    = 24 * MS_PER_HOUR;

        const days = Math.floor(remaining / MS_PER_DAY);
        remaining -= days * MS_PER_DAY;

        const hours = Math.floor(remaining / MS_PER_HOUR);
        remaining -= hours * MS_PER_HOUR;

        const minutes = Math.floor(remaining / MS_PER_MINUTE);
        remaining -= minutes * MS_PER_MINUTE;

        const seconds = Math.floor(remaining / MS_PER_SECOND);

        return { months, days, hours, minutes, seconds };
    }

    let previousSeconds = -1;

    function updateCountdown() {
        const now = new Date();
        const diff = TARGET_DATE.getTime() - now.getTime();

        if (diff <= 0) {
            monthsEl.textContent  = '00';
            daysEl.textContent    = '00';
            hoursEl.textContent   = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const { months, days, hours, minutes, seconds } =
            getCalendarBreakdown(now, TARGET_DATE);

        monthsEl.textContent  = pad(months);
        daysEl.textContent    = pad(days);
        hoursEl.textContent   = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);

        // Tick sound on second change
        if (seconds !== previousSeconds) {
            playTick();
            previousSeconds = seconds;

            // small glitch on the seconds digit every 5 seconds
            if (seconds % 5 === 0) {
                glitchNumber(secondsEl);
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // start random glitches
    scheduleGlitch();
})();
