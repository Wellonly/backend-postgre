import ms from 'ms';

import { userSessions_maintain } from '../resolvers/user';
import { log2db } from './logs';

const minMaintenanceInterval = '8h';
const defaultInterval = process.env.MAINTENANCE_INTERVAL || minMaintenanceInterval;
let intervalId: NodeJS.Timeout;

/**
 * 
 * @param interval : number in mS; string: '2d' | '8h' | '30m' and so on 
 */
export function maintenance_init(interval: number | string = defaultInterval) {
  if (typeof interval !== 'number') interval = ms(interval);
  if (interval < ms(minMaintenanceInterval)) {
    throw Error(`Error: maintenance interval: ${interval}mS that less then minimal allowed: ${minMaintenanceInterval}`);
  }
  intervalId = setInterval(maintenance, interval);
};

function maintenance() {
  try {
    const message = userSessions_maintain();
    log2db('maintenance:ok', message).then(() => null);
  } catch (err) {
    log2db('maintenance:error', err.message).then(() => null);
  }
};
