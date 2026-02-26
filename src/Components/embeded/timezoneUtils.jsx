// src/utils/timezoneUtils.js

export const convertDateToISO = (dateStr) => {
  try {
    if (typeof dateStr === 'string' && dateStr.includes(' ')) {
      const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      
      const parts = dateStr.trim().split(' ');
      if (parts.length !== 3) return null;
      
      const [day, month, year] = parts;
      const monthNum = months[month];
      
      if (!monthNum) return null;
      
      return `${year}-${monthNum}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  } catch (error) {
    console.error('Error converting date:', error);
    return null;
  }
};

export const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
  try {
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) return { date: dateStr, time: timeStr };

    const utcDateTimeStr = `${isoDate}T${timeStr}Z`; 

    const date = new Date(utcDateTimeStr);

    if (isNaN(date.getTime())) {
      return { date: dateStr, time: timeStr };
    }

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: toTimezone,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);

    const partMap = parts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

    const newDate = `${partMap.day} ${partMap.month} ${partMap.year}`;
    const newTime = `${partMap.hour.padStart(2, '0')}:${partMap.minute.padStart(2, '0')}:00`;

    return { date: newDate, time: newTime };
  } catch (err) {
    console.error('Conversion failed:', err);
    return { date: dateStr, time: timeStr };
  }
};

export const convertDisabledTimesToTimezone = (disabledTimes, targetTimezone, WORKSPACE_TIMEZONE = 'Africa/Cairo') => {
  if (!disabledTimes || !Array.isArray(disabledTimes)) return [];

  return disabledTimes.map(disabled => {
    try {
      let { date: originalDate, time } = disabled;
      if (!originalDate || !time) return disabled;

      let isoDate = originalDate;
      if (!originalDate.includes('-') || originalDate.split('-')[0].length !== 4) {
        isoDate = convertDateToISO(originalDate);
      }

      if (!isoDate) {
        console.warn('Could not parse disabled date:', originalDate);
        return { date: originalDate, time };
      }

      const [hours, minutes] = time.split(':').map(Number);
      const utcDate = new Date(`${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(utcDate);
      const year = parts.find(p => p.type === 'year').value;
      const month = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      const hour = parts.find(p => p.type === 'hour').value;
      const minute = parts.find(p => p.type === 'minute').value;

      const convertedISO = `${year}-${month}-${day}`;
      const convertedTime = `${hour}:${minute}:00`;

      return { date: convertedISO, time: convertedTime };
    } catch (error) {
      console.warn('Failed to convert disabled time:', disabled, error);
      return disabled;
    }
  });
};

export const isTimePast = (dateStr, timeStr) => {
  try {
    const formattedDate = convertDateToISO(dateStr);
    if (!formattedDate || !timeStr || !timeStr.includes(':')) return false;
    
    const now = new Date();
    const selectedDateTime = new Date(`${formattedDate}T${timeStr}:00`);
    
    return selectedDateTime < now;
  } catch (error) {
    return false;
  }
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};