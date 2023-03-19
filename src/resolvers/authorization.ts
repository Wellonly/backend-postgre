// import { ForbiddenError } from 'apollo-server';
// import { combineResolvers, skip } from 'graphql-resolvers';
// const { } = require('../utils/logs');

export const BOT_UID = 1;

/**
 * 
 * @param me 
 * @param id=0
 * @returns true if me.isAdmin || id === uid
 */
export function isMeAdminOrIdOwner(me, id = 0) {
  const uid = (me && me.uid) || 0;
  return (!!uid && (me.isAdmin || id === uid));
};

/**
 * 
 * @param me 
 * @param id
 * @returns true if me.uid === id
 */
export function isMeIdBelongsOwner(me, id) {
  const uid = (me && me.uid) || 0;
  return (!!uid && uid === id);
};

/**
 * 
 * @param me 
 * @param id
 * @returns true if me.uid === id || me.uid === id2
 */
export function isMeIdsBelongsOwner(me, id, id2) {
  const uid = (me && me.uid) || 0;
  return (!!uid && (uid === id || uid === id2));
};

export function isMeAdminOrIdsOwner (me, id = 0, id2 = 0) {
  const uid = (me && me.uid) || 0;
  return (!!uid && (me.isAdmin || id === uid || id2 === uid));
};

/**
 * isAuthorized call back
 * @param me 
 * @returns true if uid != 0
 */
export function isAuthorized(me) { return me && !!me.uid;}

/**
 * isAuthorizedAsAdmin call back
 * @param me 
 * @returns true if me.isAdmin === true
 */
export function isAuthorizedAsAdmin(me) { return (me && me.uid && me.isAdmin); };

/**
 * 
 * @param me 
 * @param row
 * @returns true if me.uid === row.user_id
 */
export function isAuthorizedAsOwner(me, row) { return isMeIdBelongsOwner(me, row.user_id);}

/**
 * 
 * @param me 
 * @param row
 * @returns true if me.uid === row.user_id || me.uid === row.to_id
 */
export function isAuthorizedAsToFromOwner(me, row) { return isMeIdsBelongsOwner(me, row.user_id, row.to_id);}

export function isAuthorizedAsOwnerOrBot(me, row) { return isMeIdBelongsOwner(me, row.user_id) || row.user_id === BOT_UID;}

/**
 * Must be used for users db only
 * @param me 
 * @param row 
 */
export function isAuthorizedWithRowId(me, row) { return isMeAdminOrIdOwner(me, row.id);}

export function isAuthorizedWithRowUserId(me, row) { return isMeAdminOrIdOwner(me, row.user_id);}
