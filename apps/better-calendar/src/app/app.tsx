// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  BetterCalendar,
  ClientData,
  data,
  Month,
  months,
  validateMonth,
} from '@calendar-app/calendars';
import { useEffect, useState } from 'react';

export function App() {
  const [selectedMonth, setSelectedMonth] = useState<Month>('January');
  const [selectedUser, setSelectedUser] = useState(data.users[0]);

  return (
    <>
      <MonthDropdown
        startingValue={selectedMonth}
        onChange={(x) => {
          setSelectedMonth(x);
        }}
      />
      <UserDropdown
        startingValue={selectedUser}
        onChange={(user) => {
          setSelectedUser(user);
        }}
      />
      <BetterCalendar selectedUserId={selectedUser.id} month={selectedMonth} />

      {/* {selectedMonth};<pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(selectedUser, null, 2)}</pre> */}
    </>
  );
}

function MonthDropdown({
  startingValue,
  onChange,
}: {
  startingValue: Month;
  onChange: (x: Month) => void;
}) {
  const [month, setMonth] = useState<Month>(startingValue);

  useEffect(() => {
    onChange(month);
  }, [month, onChange]);

  return (
    <select
      id="month"
      onChange={({ target }) => {
        validateMonth(target.value);
        setMonth(target.value);
      }}
      value={month}
    >
      {months.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  );
}

function UserDropdown({
  startingValue,
  onChange,
}: {
  startingValue: ClientData['users'][number];
  onChange: (x: ClientData['users'][number]) => void;
}) {
  const [user, setUser] = useState<ClientData['users'][number]>(startingValue);

  useEffect(() => {
    onChange(user);
  }, [user, onChange]);

  return (
    <select
      onChange={({ target }) => {
        const user = data.users.find((user) => user.id === target.value);
        if (!user) {
          throw new Error(`unable to find user at selectedId: ${target.value}`);
        }
        setUser(user);
      }}
      value={user.id}
    >
      {data.users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}

export default App;
