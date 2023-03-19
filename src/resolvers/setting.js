// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAuthorizedAsAdmin } from './authorization';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';

export default {
  Query: {
    Setting: (parent, args, { models, me }) => {
      return readRecord(me, models.Setting, args);
    },
    allSettings: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Setting, args);
    },
    _allSettingsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Setting, args)};
    },
  },

  Mutation: {
    createSetting: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Setting, args, isAuthorizedAsAdmin);
    },

    updateSetting: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Setting, args, isAuthorizedAsAdmin);
    },

    removeSetting: (parent, args, { models, me }) => {
      return removeRecord(me, models.Setting, args, isAuthorizedAsAdmin);
    },
  },

};
