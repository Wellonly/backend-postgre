// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAuthorizedWithRowUserId, isAuthorizedAsOwner, isAuthorizedAsOwnerOrBot, BOT_UID } from './authorization';
import { findAllOptions, countAllFiltered } from '../utils/ra-sequelize';
import { secureReturn, logError } from '../utils/logs';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';
import { INBOX_FIELD_NAME, OUTBOX_FIELD_NAME } from '../seed/commonFolders';

export default {
  Query: {
    Folder: (parent, args, { models, me }) => {
      return readRecord(me, models.Folder, args, isAuthorizedAsOwnerOrBot);
    },
    allFolders: (parent, args, { models, me }, info) => {
      if (!me) return secureReturn('allFolders', 'no me', args, models.Folder);
      const metrics = args?.filter?.metrics;
      addFolderFilterByUID(me, args);
      console.log('..zv allFolders args:', args);
      if (metrics) Reflect.deleteProperty(args.filter, 'metrics');
      return models.Folder.findAll(findAllOptions(args, [['priority', 'ASC']], models.Folder)).then(folders => {
        if (metrics && (metrics === INBOX_FIELD_NAME || metrics === OUTBOX_FIELD_NAME)) {
          return Promise.all(folders.map((fold) => {
            const messageFilter = addMessageFilterOnMetrics(me, metrics, fold.id);
            return Promise.all([
              countAllFiltered(me, models.Message, {filter: {...messageFilter}}),
              countAllFiltered(me, models.Message, {filter: {...messageFilter, readAt: null}})
            ]).then(counters => {
              if (Array.isArray(counters) && counters.length === 2) {
                const infold = counters[0];
                const unread = counters[1];
                fold.dataValues.name = fold.dataValues.name.concat(` ${unread ? unread: 0} / ${infold ? infold: 0}`);
              }
              return fold;
            }).catch(e => fold); //ignore errors, returns without counters
          }));
        }
        return folders;
      }).catch(err => {
        logError(err, 'allFolders', args, models.Folder);
        return null;
      });
    },
    _allFoldersMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Folder, args)};
    },
  },

  Mutation: {
    createFolder: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Folder, args);
    },
    updateFolder: (parent, args, { models, me, req }, info ) => {
      return updateRecord(me, models.Folder, args, isAuthorizedWithRowUserId);
    },
    removeFolder: (parent, args, { models, me, req }) => {
      return removeRecord(me, models.Folder, args, isAuthorizedAsOwner);
    },
  },

  Folder: {
    User: (folder, args, { models, me }) => {
      if (!me || !args.include) return;
      return models.User.findByPk(folder.user_id);
    },
    Messages: (folder, args, { models, me }) => {
      if (!me || !args.limit) return;
      return folder.getMessages(findAllOptions(args, [['updatedAt', 'ASC']], folder));
    },
  },
};

function addFolderFilterByUID(me, args) {
  if (!args.filter) args.filter = {};
  args.filter.user_id_or = [BOT_UID, me.uid];
}

export function addMessageFilterOnMetrics(me, fieldName, foldId) {
  const result = {};
  if (fieldName === OUTBOX_FIELD_NAME) {
    result.user_id = me.uid;
  }
  else {
    result.to_id = me.uid;
  }
  result[fieldName] = foldId;
  return result;
}