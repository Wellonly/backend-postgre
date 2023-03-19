// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAuthorizedAsAdmin } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Option: (parent, args, { models, me }) => {
      return readRecord(me, models.Option, args);
    },
    allOptions: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Option, args, undefined, [['name', 'ASC']]);
    },
    _allOptionsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Option, args)};
    },
  },

  Mutation: {
    createOption: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Option, args, isAuthorizedAsAdmin);
    },

    updateOption: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Option, args, isAuthorizedAsAdmin);
    },

    removeOption: (parent, args, { models, me }) => {
      return removeRecord(me, models.Option, args, isAuthorizedAsAdmin);
    },
  },
};
