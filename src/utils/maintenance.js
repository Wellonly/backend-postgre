const ms = require('ms');
const { userSessions_maintain } = require('../resolvers/user');
const { log2db } = require('./logs');

const minMaintenanceInterval = '8h';
const defaultInterval = process.env.MAINTENANCE_INTERVAL || minMaintenanceInterval;
let intervalId;

const maintenance_init = (interval = defaultInterval) => {
  if (typeof interval !== 'number') interval = ms(interval);
  if (interval < ms(minMaintenanceInterval)) {
    throw `Error: maintenance interval: ${interval}mS that less then minimal allowed: ${minMaintenanceInterval}`;
  }

  intervalId = setInterval(maintenance, interval);
};
module.exports.maintenance_init = maintenance_init;

const maintenance = () => {
  try {
    const message = userSessions_maintain();
    log2db('maintenance:ok', message, null).then(result => result);
  } catch (err) {
    log2db('maintenance:error', err.message, null).then(result => result);
  }
};