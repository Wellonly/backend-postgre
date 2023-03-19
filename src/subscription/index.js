import { PubSub } from 'apollo-server';

import MESSAGE_EVENTS from './message';
import LOG_EVENTS from './log';

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
  LOG: LOG_EVENTS,
};

export const pubsub = new PubSub();
