import { isAuthorizedWithRowUserId, isAuthorizedAsOwner, isAuthorizedAsOwnerOrBot, BOT_UID } from './authorization';
import { findAllOptions, countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Folder: (parent, args, { models, me }) => {
      return readRecord(me, models.Folder, args, isAuthorizedAsOwnerOrBot);
    },
    allFolders: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Folder, args, undefined, [['priority', 'ASC']]);
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
