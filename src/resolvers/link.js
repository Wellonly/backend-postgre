// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { isAdmin, isAuthenticated } from './authorization';
import { findAllOptions, findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, checkImages, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Link: (parent, args, { models, me }) => {
      return readRecord(me, models.Link, args);
    },
    allLinks: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Link, args, undefined, [['priority', 'ASC']]);
    },
    _allLinksMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Link, args)};
    },
  },
  Mutation: {
    createLink: (parent, args, { models, me }, info) => {
      return createRecord(me, models.Link, args, checkImages);
    },

    updateLink: (parent, args, { models, me }, info) => {
      return updateRecord(me, models.Link, args, checkImages);
    },

    removeLink: (parent, args, { models, me }) => {
      return removeRecord(me, models.Link, args);
    },
  },
  Link: {
    Sublinks: (link, args, { models, me }, info) => {
      if (!me) return;
      return link.getSublinks(findAllOptions(args, [['priority', 'ASC']], link));
    },
  },
};