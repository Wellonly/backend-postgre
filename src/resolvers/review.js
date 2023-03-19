// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
import { countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
// import {  } from './authorization';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Review: (parent, args, { models, me }, info) => {
      return readRecord(me, models.Review, args);
    },
    allReviews: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Review, args);
    },
    _allReviewsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Review, args)};
    },
  },

  Mutation: {
    createReview: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Review, args);
    },

    updateReview: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Review, args);
    },

    removeReview: (parent, args, { models, me }) => {
      return removeRecord(me, models.Review, args);
    },
  },

  Review: {
    Command: async (review, args, { models, me }, info) => {
      if (!me) return;
      return models.Command.findByPk(review.command_id);
    },
    Product: async (review, args, { models, me }, info) => {
      if (!me) return;
      return models.Product.findByPk(review.product_id);
    },
    Customer: async (review, args, { models, me }, info) => {
      if (!me) return;
      return models.Customer.findByPk(review.customer_id);
    },
  },
};
