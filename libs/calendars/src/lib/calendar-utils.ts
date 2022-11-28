export const daysOfTheWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
export type DayOfTheWeek = typeof daysOfTheWeek[number];
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
export type Month = typeof months[number];
export const daysPerMonth: Record<Month, number> = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
};
export interface CalendarDate {
  month: Month;
  dayOfTheWeek: DayOfTheWeek;
  date: number;
}
export type HabitResult = 'success' | 'failure';

type DisplayResult = 'success' | 'failure' | 'no result yet' | 'out of bounds';
function nextMonth(month: Month): Month {
  if (month === 'December') {
    return 'January';
  }
  return months[months.indexOf(month) + 1];
}
export function nextDayOfWeek(day: DayOfTheWeek): DayOfTheWeek {
  if (day === 'Saturday') {
    return 'Sunday';
  }
  return daysOfTheWeek[daysOfTheWeek.indexOf(day) + 1];
}
function nextCalendarDay(calendarDay: CalendarDate): CalendarDate {
  if (calendarDay.date === daysPerMonth[calendarDay.month]) {
    return {
      month: nextMonth(calendarDay.month),
      date: 1,
      dayOfTheWeek: nextDayOfWeek(calendarDay.dayOfTheWeek),
    };
  }
  return {
    month: calendarDay.month,
    date: calendarDay.date + 1,
    dayOfTheWeek: nextDayOfWeek(calendarDay.dayOfTheWeek),
  };
}
function previousMonth(month: Month): Month {
  if (month === 'January') {
    return 'December';
  }
  return months[months.indexOf(month) - 1];
}
function previousDate(calendarDay: CalendarDate): number {
  if (calendarDay.date === 1) {
    return daysPerMonth[previousMonth(calendarDay.month)];
  }
  return calendarDay.date - 1;
}
function previousDay(day: DayOfTheWeek): DayOfTheWeek {
  if (day === 'Sunday') {
    return 'Saturday';
  }
  return daysOfTheWeek[daysOfTheWeek.indexOf(day) - 1];
}
function previousCalendarDay(calendarDay: CalendarDate): CalendarDate {
  return {
    dayOfTheWeek: previousDay(calendarDay.dayOfTheWeek),
    date: previousDate(calendarDay),
    month:
      calendarDay.date === 1
        ? previousMonth(calendarDay.month)
        : calendarDay.month,
  };
}

export interface HabitTrackerProps {
  startDay: CalendarDate;
  endDay: CalendarDate;
  results: HabitResult[];
}

export type ResultToDisplay = HabitResult | 'out of bounds' | 'no result yet';

export interface HabitTrackerDay {
  month: Month;
  date: number;
  result: ResultToDisplay;
}

export type HabitTrackerWeek = Record<DayOfTheWeek, HabitTrackerDay>;

export type HabitTrackerData = Record<string, HabitTrackerWeek>;

export interface HabitTrackerTemplateData {
  weekNames: string[];
  data: HabitTrackerData;
  maxSuccessStreak: number;
  maxFailureStreak: number;
}

export function createHabitTrackerTemplateData({
  startDay,
  endDay,
  results,
}: HabitTrackerProps): HabitTrackerTemplateData {
  const weekNames = ['week-1'];
  const firstWeekOutOfBoundsDates = {} as any;
  let firstWeekPointer = { ...startDay };
  while (firstWeekPointer.dayOfTheWeek !== 'Sunday') {
    firstWeekPointer = previousCalendarDay(firstWeekPointer);
    firstWeekOutOfBoundsDates[firstWeekPointer.dayOfTheWeek] = {
      month: firstWeekPointer.month,
      date: firstWeekPointer.date,
      result: 'out of bounds',
    } as const;
  }
  const data: Record<
    string,
    Record<DayOfTheWeek, { month: Month; date: number; result: DisplayResult }>
  > = {
    'week-1': { ...firstWeekOutOfBoundsDates } as any,
  };
  let dayIndex = 0;
  let dayPointer = { ...startDay };
  let weekCounter = 0;
  while (dayPointer.date !== endDay.date || dayPointer.month !== endDay.month) {
    data[`week-${weekCounter + 1}`][dayPointer.dayOfTheWeek] = {
      month: dayPointer.month,
      date: dayPointer.date,
      result: results[dayIndex] || 'no result yet',
    };
    dayPointer = nextCalendarDay(dayPointer);
    dayIndex++;
    if (dayPointer.dayOfTheWeek === 'Sunday') {
      weekCounter++;
      const newWeekName = `week-${weekCounter + 1}`;
      weekNames.push(newWeekName);
      data[newWeekName] = {} as any;
    }
  }
  data[`week-${weekCounter + 1}`][dayPointer.dayOfTheWeek] = {
    month: dayPointer.month,
    date: dayPointer.date,
    result: results[dayIndex] || 'no result yet',
  };
  while (dayPointer.dayOfTheWeek !== 'Saturday') {
    dayPointer = nextCalendarDay(dayPointer);
    data[`week-${weekCounter + 1}`][dayPointer.dayOfTheWeek] = {
      month: dayPointer.month,
      date: dayPointer.date,
      result: 'out of bounds',
    };
  }
  return {
    data,
    weekNames,
    ...determineStreakInfo(results),
  };
}

export function determineStreakInfo(results: HabitResult[]): {
  maxSuccessStreak: number;
  maxFailureStreak: number;
} {
  let maxSuccessStreak = 0;
  let maxFailureStreak = 0;
  let currentStreak: { kind: HabitResult; count: number } = {
    kind: 'success',
    count: 0,
  };
  for (const result of results) {
    if (result === currentStreak.kind) {
      currentStreak.count++;
    } else {
      currentStreak = { kind: result, count: 1 };
    }
    if (result === 'success' && currentStreak.count > maxSuccessStreak) {
      maxSuccessStreak = currentStreak.count;
    }
    if (result === 'failure' && currentStreak.count > maxFailureStreak) {
      maxFailureStreak = currentStreak.count;
    }
  }
  return { maxFailureStreak, maxSuccessStreak };
}

export function getMonthDates(
  month: Month
): Record<DayOfTheWeek, number | undefined>[] {
  let dayOfWeek = firstDaysOfTheMonth[month];
  const toReturn: Record<DayOfTheWeek, number | undefined>[] = [];
  const pushOnBlankWeek = () => {
    toReturn.push({
      Sunday: undefined,
      Monday: undefined,
      Tuesday: undefined,
      Wednesday: undefined,
      Thursday: undefined,
      Friday: undefined,
      Saturday: undefined,
    });
  };
  pushOnBlankWeek();
  for (let i = 1; i <= daysPerMonth[month]; i++) {
    toReturn.slice(-1)[0][dayOfWeek] = i;

    if (dayOfWeek === 'Saturday' && i !== daysPerMonth[month]) {
      pushOnBlankWeek();
    }
    dayOfWeek = nextDayOfWeek(dayOfWeek);
  }
  return toReturn;
}

export const firstDaysOfTheMonth: Record<Month, DayOfTheWeek> = {
  January: 'Sunday',
  February: 'Wednesday',
  March: 'Wednesday',
  April: 'Saturday',
  May: 'Monday',
  June: 'Thursday',
  July: 'Sunday',
  August: 'Tuesday',
  September: 'Friday',
  October: 'Sunday',
  November: 'Wednesday',
  December: 'Friday',
};

export function validateMonth(x: any): asserts x is Month {
  if (!months.includes(x)) {
    throw Error(`invalid date: ${x}`);
  }
}
