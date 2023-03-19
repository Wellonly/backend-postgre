// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { checkImages, updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Sublink: (parent, args, { models, me }) => {
      return readRecord(me, models.Sublink, args);
    },
    allSublinks: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Sublink, args, undefined, [['priority', 'ASC']]);
    },
    _allSublinksMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Sublink, args)};
    },
  },

  Mutation: {
    createSublink: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Sublink, args, checkImages);
    },

    updateSublink: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Sublink, args, checkImages);
    },

    removeSublink: (parent, args, { models, me }) => {
      return removeRecord(me, models.Sublink, args);
    },
  },
};

