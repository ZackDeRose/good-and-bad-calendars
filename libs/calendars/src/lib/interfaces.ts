import { daysPerMonth, months } from './calendar-utils';

export interface ClientData {
  users: {
    id: string;
    name: string;
    events: {
      id: string;
      name: string;
      date: string;
    }[];
  }[];
}

export function randomValidDateString(): string {
  const month = Math.ceil(Math.random() * months.length);
  const day = Math.ceil(Math.random() * daysPerMonth[months[month - 1]]);
  return `${months[month - 1]} ${day}`;
}
