// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { isAdmin, isAuthenticated } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, checkImages, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Paymethod: (parent, args, { models, me }) => {
      return readRecord(me, models.Paymethod, args);
    },
    allPaymethods: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Paymethod, args, undefined, [['priority', 'ASC']]);
    },
    _allPaymethodsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Paymethod, args)};
    },
  },

  Mutation: {
    createPaymethod: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Paymethod, args, checkImages);
    },

    updatePaymethod: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Paymethod, args, checkImages);
    },

    removePaymethod: (parent, args, { models, me }) => {
      return removeRecord(me, models.Paymethod, args);
    },
  },
};
