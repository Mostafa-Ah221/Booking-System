export const calculateAvailableTimeSlots = ({
  selectedDate = null,
  day = null,
  month = null,
  year = null,
  availableTimes = [],
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = [],
  durationCycle = 15,
  durationPeriod = "minutes"
}) => {
  // تحويل التاريخ إلى صيغة موحدة (ISO: "YYYY-MM-DD")
  const convertDateFormat = (dateStr) => {
    try {
      const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      const parts = dateStr?.trim().split(' ');
      if (parts?.length !== 3) return null;
      const [day, month, year] = parts;
      const monthNum = months[month];
      if (!monthNum) return null;
      return `${year}-${monthNum}-${day.padStart(2, '0')}`;
    } catch (error) {
      return null;
    }
  };

  const getDayIdFromDate = (dateStr, day, month, year) => {
    try {
      let date;
      if (dateStr) {
        date = new Date(convertDateFormat(dateStr) + 'T00:00:00.000Z');
      } else if (day !== null && month !== null && year !== null) {
        date = new Date(Date.UTC(year, month, day));
      } else {
        return null;
      }
      if (isNaN(date.getTime())) return null;
      const dayOfWeek = date.getUTCDay();
      return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    } catch (error) {
      return null;
    }
  };

  const isTimePast = (dateStr, timeStr, dateObj) => {
    try {
      let formattedDate;
      if (dateStr) {
        formattedDate = convertDateFormat(dateStr);
      } else if (dateObj) {
        formattedDate = dateObj.toISOString().split('T')[0];
      } else {
        return false;
      }
      const now = new Date();
      const selectedDateTime = new Date(`${formattedDate}T${timeStr}:00`);
      return selectedDateTime < now;
    } catch (error) {
      return false;
    }
  };

  const isDateInUnavailableRange = (dateStr, day, month, year) => {
    if (!unavailableDates || !Array.isArray(unavailableDates) || unavailableDates.length === 0) {
      return false;
    }
    try {
      let checkDate;
      if (dateStr) {
        checkDate = new Date(convertDateFormat(dateStr) + 'T00:00:00.000Z');
      } else {
        checkDate = new Date(Date.UTC(year, month, day));
      }
      return unavailableDates.some(dateRange => {
        try {
          let fromDateStr = dateRange.from.includes(' ') ? dateRange.from.split(' ')[0] : dateRange.from;
          let toDateStr = dateRange.to.includes(' ') ? dateRange.to.split(' ')[0] : dateRange.to;
          fromDateStr = fromDateStr.replace(/\//g, '-');
          toDateStr = toDateStr.replace(/\//g, '-');
          let fromParts = fromDateStr.split('-');
          let toParts = toDateStr.split('-');
          if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
            fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
          }
          if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
            toDateStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
          }
          const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
          const toDate = new Date(toDateStr + 'T00:00:00.000Z');
          return checkDate >= fromDate && checkDate <= toDate;
        } catch (error) {
          return false;
        }
      });
    } catch (error) {
      return false;
    }
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // تحديد التاريخ
  let dateISO;
  if (selectedDate) {
    if (typeof selectedDate === 'string') {
      dateISO = convertDateFormat(selectedDate);
    } else if (selectedDate instanceof Date) {
      dateISO = selectedDate.toISOString().split('T')[0];
    }
  } else if (day !== null && month !== null && year !== null) {
    dateISO = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  } else {
    return [];
  }
  if (!dateISO) return [];

  // تحديد يوم الأسبوع
  const targetDayId = getDayIdFromDate(selectedDate, day, month, year);
  if (!targetDayId) return [];

  // فلترة الفترات المتاحة ليوم الأسبوع المحدد
  const timeRangesForSelectedDay = availableTimes.filter(timeRange => 
    timeRange && timeRange.day_id === targetDayId
  );
  if (timeRangesForSelectedDay.length === 0) return [];

  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const timeSlots = [];

  // التحقق من التاريخ إذا كان في نطاق غير متاح
  const isUnavailableDate = isDateInUnavailableRange(selectedDate, day, month, year);
  const dayUnavailableTimes = unavailableTimes.filter(time => time.day_id === targetDayId);

  timeRangesForSelectedDay.forEach((timeRange) => {
    if (!timeRange || !timeRange.from || !timeRange.to) return;

    const [fromHour, fromMinute] = timeRange.from.split(":").map(Number);
    const [toHour, toMinute] = timeRange.to.split(":").map(Number);
    if (isNaN(fromHour) || isNaN(fromMinute) || isNaN(toHour) || isNaN(toMinute)) return;

    const start = new Date();
    start.setHours(fromHour, fromMinute, 0, 0);
    const end = new Date();
    end.setHours(toHour, toMinute, 0, 0);

    let currentRanges = [{ from: timeToMinutes(timeRange.from), to: timeToMinutes(timeRange.to) }];

    // استبعاد الأوقات غير المتاحة
    if (isUnavailableDate && dayUnavailableTimes.length > 0) {
      dayUnavailableTimes.forEach((unavailableRange) => {
        if (!unavailableRange || !unavailableRange.from || !unavailableRange.to) return;
        const unavailableFromMinutes = timeToMinutes(unavailableRange.from);
        const unavailableToMinutes = timeToMinutes(unavailableRange.to);
        const newRanges = [];
        currentRanges.forEach((range) => {
          if (unavailableToMinutes <= range.from || unavailableFromMinutes >= range.to) {
            newRanges.push(range);
          } else if (unavailableFromMinutes <= range.from && unavailableToMinutes < range.to) {
            newRanges.push({ from: unavailableToMinutes, to: range.to });
          } else if (unavailableFromMinutes > range.from && unavailableToMinutes >= range.to) {
            newRanges.push({ from: range.from, to: unavailableFromMinutes });
          } else if (unavailableFromMinutes > range.from && unavailableToMinutes < range.to) {
            newRanges.push({ from: range.from, to: unavailableFromMinutes });
            newRanges.push({ from: unavailableToMinutes, to: range.to });
          }
        });
        currentRanges = newRanges;
      });
    }

    // توليد الأوقات المتاحة
    currentRanges.forEach((range) => {
      const startMinutes = range.from;
      const endMinutes = range.to;
      for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += durationInMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // التحقق من الأوقات المحجوزة
        const isDisabled = disabledTimes.some(disabledTime => {
          if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
          const disabledDate = disabledTime.date;
          const disabledTimeFormatted = disabledTime.time.slice(0, 5);
          return disabledDate === dateISO && disabledTimeFormatted === formattedTime;
        });

        // التحقق من الأوقات الماضية
        const isPast = isTimePast(selectedDate, formattedTime, selectedDate instanceof Date ? selectedDate : null);

        if (!isDisabled && !isPast) {
          timeSlots.push({ time: formattedTime });
        }
      }
    });
  });

  // إرجاع الأوقات المتاحة بدون تكرار
  return [...new Set(timeSlots.map(slot => slot.time))].sort();
};