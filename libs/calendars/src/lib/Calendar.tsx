import { Fragment, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import {
  DayOfTheWeek,
  daysOfTheWeek,
  getMonthDates,
  Month,
} from './calendar-utils';
import { ClientData } from './interfaces';
import { data } from './sample-data';

let i = 0;
export interface CalendarProps {
  month: Month;
  selectedUserId: string;
}

export function Calendar({ month, selectedUserId }: CalendarProps) {
  const [monthDates, setMonthDates] = useState<
    Record<DayOfTheWeek, number | undefined>[] | undefined
  >(undefined);

  useEffect(() => {
    setMonthDates(getMonthDates(month));
  }, [month]);

  function getEventsForDay(day: string): ClientData['users'][number]['events'] {
    const events: ClientData['users'][number]['events'] = [];
    for (const user of data.users) {
      for (const event of user.events) {
        console.log(i++);
        if (user.id === selectedUserId && event.date === day) {
          events.push(event);
        }
      }
    }
    return events;
  }

  function findEventById(
    id: string
  ): ClientData['users'][number]['events'][number] {
    for (const user of data.users) {
      for (const event of user.events) {
        console.log(i++);
        if (event.id === id) {
          return event;
        }
      }
    }
    throw new Error(`unable to find event with id: ${id}`);
  }

  return (
    <div className="grid place-content-center">
      <h1 className="text-5xl text-center m-2">{month}</h1>
      {monthDates?.map((week, i) => (
        <div
          key={i}
          className="grid grid-cols-7 place-items-center justify-start align-middle"
        >
          {daysOfTheWeek.map((dayOfTheWeek) => {
            const isFirstWeek = i === 0;
            const isLastWeek = i === monthDates.length - 1;
            return (
              <div
                className={`
                h-24
                w-24
                ${week[dayOfTheWeek] == undefined ? 'bg-gray-300' : ''}
                border-2
                ${isFirstWeek ? 'border-t-4 ' : ' '}
                ${isLastWeek ? 'border-b-4 ' : ' '}
                ${dayOfTheWeek === 'Sunday' ? 'border-l-4' : ''}
                ${dayOfTheWeek === 'Saturday' ? 'border-r-4' : ''}
                ${
                  isFirstWeek && dayOfTheWeek === 'Sunday'
                    ? 'rounded-tl-2xl'
                    : ''
                }
                ${
                  isFirstWeek && dayOfTheWeek === 'Saturday'
                    ? 'rounded-tr-2xl'
                    : ''
                }
                ${
                  isLastWeek && dayOfTheWeek === 'Sunday'
                    ? 'rounded-bl-2xl'
                    : ''
                }
                ${
                  isLastWeek && dayOfTheWeek === 'Saturday'
                    ? 'rounded-br-2xl'
                    : ''
                }
                relative
              `}
                key={`${i}|${dayOfTheWeek}`}
              >
                {week[dayOfTheWeek] ? (
                  <div
                    className={`top-0 left-0 m-1 rounded-full h-4 w-4 md:h-6 md:w-6 flex items-center justify-center bg-blue-500 text-white md:text-sm text-xs z-10`}
                  >
                    {week[dayOfTheWeek]}
                  </div>
                ) : (
                  <></>
                )}
                <div className="grid grid-cols-5 gap-y-1">
                  {getEventsForDay(`${month} ${week[dayOfTheWeek]}`).map(
                    (event) => (
                      <Fragment key={event.id}>
                        <div
                          className="bg-red-500 rounded-full h-4 w-4 cursor-pointer"
                          data-for={event.id}
                          data-tip={`${findEventById(event.id).name}`}
                        ></div>
                        <ReactTooltip
                          id={event.id}
                          place="right"
                          type="info"
                          effect="float"
                          multiline
                        />
                      </Fragment>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Calendar;
