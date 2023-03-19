// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, readRecord, createRecord } from './lib';

export default {
  Query: {
    Category: (parent, args, { models, me }) => {
      return readRecord(me, models.Category, args);
    },
    allCategories: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Category, args, undefined, [['priority', 'ASC']]);
    },
    _allCategoriesMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Category, args)};
    },
  },

  Mutation: {
    createCategory: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Category, args);
    },

    updateCategory: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Category, args);
    },

    removeCategory: (parent, args, { models, me }) => {
      return removeRecord(me, models.Category, args);
    },
  },

  Category: {
    Products: async (category, args, { models, me }, info) => {
      if (!me) return;
      const { limit } = args;
      return models.Product.findAll({
        where: {
          category_id: category.id,
        },
        limit: (isNaN(+limit) ? null: +limit),
        order: [['priority', 'ASC']],
      });
    },
  },
};
