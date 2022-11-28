import { ClientData, randomValidDateString } from './interfaces';
import { faker } from '@faker-js/faker';

const fullName = faker.name.fullName;
let userIdCounter = 0;
let eventIdCounter = 0;

export const data: ClientData = {
  users: [],
};

const NUM_USERS = 100;
const NUM_EVENTS_PER_USER = 100;

for (let i = 0; i < NUM_USERS; i++) {
  data.users.push(createUser());
}

function createUser(): ClientData['users'][number] {
  const name = fullName();
  const id = `${userIdCounter++}`;
  const events = [];
  for (let i = 0; i < NUM_EVENTS_PER_USER; i++) {
    events.push(createEvent());
  }
  return {
    name,
    id,
    events,
  };
}

function createEvent(): ClientData['users'][number]['events'][number] {
  const name = `${faker.word.adverb()} ${faker.word.verb()} the ${faker.word.adjective()} ${faker.word.noun()}`;
  const id = `${eventIdCounter++}`;
  return {
    name,
    id,
    date: randomValidDateString(),
  };
}
