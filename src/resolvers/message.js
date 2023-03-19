// import { Op } from 'sequelize';

import { pubsub, EVENTS } from '../subscription';
import { withFilter } from 'apollo-server';
import { isAuthorizedAsToFromOwner, isMeIdBelongsOwner, isMeIdsBelongsOwner, BOT_UID } from './authorization';

import { countAllFiltered, findAllFilteredAsync } from '../utils/ra-sequelize';
import { logError } from '../utils/logs';
import { updateRecord, removeRecord, createRecord, readRecord, updateRow, ArgsCode, argsFilterSuccess, argsFilterCode, argsFilterReject } from './lib';
import { PLACE, USER_FOLDERS_START_ID } from '../seed/commonFolders';
import { bottask } from '../utils/bot';

export default {
  Query: {
    Message: (parent, args, { models, me, req }) => {
      return readRecord(me, models.Message, args, isAuthorizedAsToFromOwner);
    },
    allMessages: (parent, args, { models, me }, info) => {
      return findAllFilteredAsync(me, models.Message, args, messagesArgHandlerCB, [['id', 'DESC']]);
    },
    _allMessagesMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Message, args, messagesArgHandlerCB)};
    },
  },

  Mutation: {
    createMessage: (parent, args, { models, me, req }) => {
      args.user_id = me.uid <= 0 ? 2: me.uid; //debug only, must be: args.user_id = me.uid;
      args.sentAt = new Date();
      return sendMessage(me, models.Message, args);
    },
    updateMessage: (parent, args, { models, me }) => {
      console.log('..zv: updateMessage args:', args);
      return updateRecord(me, models.Message, args, updateMessageCB);
    },
    removeMessage: (parent, args, { models, me }) => {
      return removeRecord(me, models.Message, args, removeMessageCB);
    },
  },

  Message: {
    User: (message, args, { models, me }) => {
      if (!me || !args.include) return;
      return models.User.findByPk(message.user_id);
    },
    ToUser: (message, args, { models, me }) => {
      if (!me || !args.include) return;
      return models.User.findByPk(message.to_id);
    },
    UserFolder: (message, args, { models, me }) => {
      if (!me || !args.include) return;
      return models.Folder.findByPk(message.folder_id);
    },
    InboxFolder: (message, args, { models, me }) => {
      if (!me || !args.include) return;
      return models.Folder.findByPk(message.inbox_id);
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: withFilter(() => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        (payload, variables) => { 
          const check = +payload.messageCreated?.to_id === +variables.forId;
          // console.log('..zv messageCreated check:', check, payload, variables);
          return check;
        },
      ),
    },
  },
};

export function sendMessage(me, model, args) {
  args.readAt = (+args.to_id === BOT_UID && me.isAdmin) ? new Date(): null; //set readAt if mess to Bot
  return createRecord(me, model, args).then(message => {
    // console.log('..zv Mutation.createMessage:', message);
    if (message.to_id === BOT_UID) {
      me.isAdmin && setTimeout(bottask, 0, message);
    }
    else {
      pubsub.publish(EVENTS.MESSAGE.CREATED, { messageCreated: message });
    }
    return message;
  }).catch(err => {
    logError(err, 'createMessage', args, model);
    return null;
  });
}

function updateMessageCB(me, message, args) {
  const isReadAtToBeUpdated = !message.readAt;
  const isOwner = isMeIdBelongsOwner(me, message.user_id);
  const isToUser = isMeIdBelongsOwner(me, message.to_id);
  const isAuth = isOwner || isToUser;
  console.log('..zv: updateMessageCB args:', me.uid, isAuth, isReadAtToBeUpdated, args);
  if (isAuth) {
    if (isOwner) {
      if (message.readAt) {

      }
      else {

      }
    }
    else {

    }
    // if (Reflect.has(args, '')) {}
    // if (isReadAtToBeUpdated) {
    //     const now = Date.now();
    //     const diff_ms = Math.abs(now - args.readAt);
    //     if (diff_ms > 1000) console.log('\n..zv: client-server time differ:', args.readAt, now, ': ', diff_ms/1000, ' seconds!!!');
    //     args.readAt = now;
    // }
  }
  return isAuth;
}

/**
 * CB for allMessages() & _allMessagesMeta() with args.filter mutation(manipulation)
 * @param {*} me 
 * @param {*} model 
 * @param {*} args NOTE: this CB with same args passed to allMessages() & _allMessagesMeta() in a single request
 */
async function messagesArgHandlerCB(me, model, args) {
  // console.log('..zv: messagesArgHandler args:', args);
  if (!args.filter) args.filter = {};
  const exCode = argsFilterCode(args);
  if (exCode !== ArgsCode.ARGS_CODE_UNDEFINED) return exCode === ArgsCode.ARGS_CODE_OK; //by this we prevent twice run & mutate the args(see NOTE above)
  const uid = me.uid;
  const user = parseInt(args.filter.user) || 0;
  const folder = parseInt(args.filter.folder) || 0;
  if (user) Reflect.deleteProperty(args.filter, 'user');
  if (folder) Reflect.deleteProperty(args.filter, 'folder');
  let place;
  if (folder >= USER_FOLDERS_START_ID) { //we must read the user folder place
    const fold = await model.sequelize.models.folder.findByPk(folder);
    if (!fold) return argsFilterReject(args, `folder: ${folder} not found`);
    // console.log('..zv: messagesArgHandler fold props:', fold.name, fold.place);
    if (fold.user_id !== BOT_UID || fold.user_id !== uid) return argsFilterReject(args, 'fold: no auth');
    place = fold.place;
    if (place < 0 || place >= PLACE.last) return argsFilterReject(args, `fold: bad place: ${place}`);
  }
  else {
    place = folder; //a common folder has dedicated place
  }
  //next: logic...
  if (user && place) {
    if (place === PLACE.inbox) {
      args.filter.inbox_id = folder;
      args.filter.to_id = uid;
      if (user !== uid) args.filter.user_id = user;
    }
    else {
      args.filter.folder_id = folder;
      args.filter.user_id = uid;
      if (user !== uid) args.filter.to_id = user;
    }
  }
  else if (user) {
    if (user === uid) {
      args.filter.user_id = uid;
    }
    else {
      args.filter.to_id = user;
      args.filter.user_id = uid;
    }
  }
  else if (place) {
    if (place === PLACE.inbox) {
      args.filter.inbox_id = folder;
      args.filter.to_id = uid;
    }
    else {
      args.filter.folder_id = folder;
      args.filter.user_id = uid;
    }
  }
  else { //default: no user & no folder then we use inbox...
    args.filter.inbox_id = PLACE.inbox;
    args.filter.to_id = uid;
  }
  return argsFilterSuccess(args);
}

/*
// complicate logic examples:
    args.filter[Op.or] = [
      { to_id: uid},
      { user_id: uid},
    ];
    args.filter[Op.or] = [
      { [Op.and]: [{to_id: uid}, {user_id}]},
      { [Op.and]: [{user_id: uid}, {to_id}]},
    ];
    args.filter[Op.or] = [
      { [Op.and]: [{to_id: uid}, {user_id: user}]},
      { [Op.and]: [{user_id: uid}, {to_id: user}]},
    ];
*/

const OPNAME_REMOVE_TO_UPDATE = 'remove->update';
/**
 * solve: remove or update(change fold id to deleted fold) upon folder_id
 * @param {*} me 
 * @param {*} row 
 * @param {*} args 
 */
function removeMessageCB(me, row, args) {
  const ownuid = row.user_id;
  const touid = row.to_id || -1;
  if (!isMeIdsBelongsOwner(me, ownuid, touid)) return false;
  const uid = me.uid || 0;
  let doRemove = true;
  if (uid === ownuid) { //for sender...
    if (row.folder_id !== PLACE.basket) {
      updateRow(row, {folder_id: PLACE.basket}, OPNAME_REMOVE_TO_UPDATE);
      doRemove = false; // by this we prevent remove the row 
    }
    else if (row.inbox_id !== PLACE.trash) {
      updateRow(row, {folder_id: PLACE.trash}, OPNAME_REMOVE_TO_UPDATE);
      doRemove = false; // by this we prevent remove the row 
    }
  }
  else { // for receiver...
    if (row.inbox_id !== PLACE.basket) {
      updateRow(row, {inbox_id: PLACE.basket}, OPNAME_REMOVE_TO_UPDATE);
      doRemove = false; // by this we prevent remove the row 
    }
    else if (row.folder_id !== PLACE.trash) {
      updateRow(row, {inbox_id: PLACE.trash}, OPNAME_REMOVE_TO_UPDATE);
      doRemove = false; // by this we prevent remove the row 
    }
  }
  return doRemove || {donotremove: true};
}
