<script>
    import { _lang } from '$lib/services/store';
    import _strings from './strings';

    export let date;

    const MONTH_NAMES = [
        ['ජනවාරි', 'January', 'ஜனவரி'],
        ['පෙබරවාරි', 'February', 'பிப்ரவரி'],
        ['මාර්තු', 'March', 'மார்ச்'],
        ['අප්රේල්', 'April', 'ஏப்ரல்'],
        ['මැයි', 'May', 'மே'],
        ['ජූනි', 'June', 'ஜூன்'],
        ['ජූලි', 'July', 'ஜூலை'],
        ['අගෝස්තු', 'August', 'ஆகஸ்ட்'],
        ['සැප්තැම්බර්', 'September', 'செப்டம்பர்'],
        ['ඔක්තෝබර්', 'October', 'அக்டோபர்'],
        ['නොවැම්බර්', 'November', 'நவம்பர்'],
        ['දෙසැම්බර්', 'December', 'டிசம்பர்'],
    ];

    const timeAgo = (dateParam) => {
        if (!dateParam) {
            return '';
        }

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
        const today = new Date();
        const yesterday = new Date(today.getTime() - DAY_IN_MS);
        const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();

        if (seconds < 5) {
            return _strings['now'][language];
        } else if (seconds < 60) {
            return _strings['secondsAgo'][language].replace('*seconds*', seconds.toString());
        } else if (seconds < 90) {
            return _strings['minuteAgo'][language];
        } else if (minutes < 60) {
            return _strings['minutesAgo'][language].replace('*minutes*', minutes.toString());
        } else if (isToday) {
            return getFormattedDate(date, _strings['today'][language]);
        } else if (isYesterday) {
            return getFormattedDate(date, _strings['yesterday'][language]);
        } else if (isThisYear) {
            return getFormattedDate(date, false, true);
        }
        return getFormattedDate(date);
    }

    const getFormattedDate = (date, prefomattedDate = false, hideYear = false) => {
        const day = date.getDate();
        const month = MONTH_NAMES[date.getMonth()][language];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${ minutes }`;
        }
        if (prefomattedDate) {
            return `${ prefomattedDate } ${(language == 1)? 'at': ''} ${ hours }:${ minutes }${(language == 0)? 'ට': ((language==2)? ' மணிக்கு': '')}`;
        }
        if (hideYear) {
            return `${ day } ${ month } ${(language == 1)? 'at': ''} ${ hours }:${ minutes }${(language == 0)? 'ට': ((language==2)? ' மணிக்கு': '')}`;
        }
        return `${ day } ${ month } ${ year }. ${(language == 1)? 'at': ''} ${ hours }:${ minutes }`;
    }

    let language = 0;
    let timeAgoString = timeAgo(date);

    _lang.subscribe(l => {
        language = l;
        timeAgoString = timeAgo(date);
    });

</script>

<div class="timestamp">
    {timeAgoString}
</div>

<style>
    .timestamp {
        font-size: 0.9rem;
        color: rgb(100, 99, 99);
    }
</style>