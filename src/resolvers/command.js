// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { isAdmin, isAuthenticated } from './authorization';
import { countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
import { createRecord, updateRecord, removeRecord, readRecord } from './lib';

export default {
  Query: {
    Command: (parent, args, { models, me }) => {
      return readRecord(me, models.Command, args);
    },
    allCommands: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Command, args);
    },
    _allCommandsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Command, args)};
    },
  },

  Mutation: {
    createCommand: (parent, args, { models, me }, info ) => {
      if (!args.date) args.date = new Date();
      return createRecord(me, models.Command, args);
    },

    updateCommand: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Command, args);
    },

    removeCommand: (parent, args, { models, me }) => {
      return removeRecord(me, models.Command, args);
    },
  },

  Command: {
    Customer: async (command, args, { models, me }, info) => {
      if (!me) return;
      return models.Customer.findByPk(command.id);
    },
    Invoices: async (command, args, { models, me }, info) => {
      if (!me) return;
      return models.Invoice.findAll({
        where: {
          command_id: command.id,
        },
      });
    },
    Reviews: async (command, args, { models, me }, info) => {
      if (!me) return;
      return models.Review.findAll({
        where: {
          command_id: command.id,
        },
      });
    },
  },
};
