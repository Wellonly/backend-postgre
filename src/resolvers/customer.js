// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { isAdmin, isAuthenticated } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Customer: (parent, args, { models, me }) => {
      return readRecord(me, models.Customer, args);
    },
    allCustomers: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Customer, args);
    },
    _allCustomersMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Customer, args)};
    },
  },

  Mutation: {
    createCustomer: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Customer, args);
    },

    updateCustomer: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Customer, args);
    },

    removeCustomer: (parent, args, { models, me }) => {
      return removeRecord(me, models.Customer, args);
    },
  },

  Customer: {
    Commands: async (customer, args, { models, me }, info) => {
      if (!me) return;
      return models.Command.findAll({
        where: {
          customer_id: customer.id,
        },
      });
    },
    Invoices: async (customer, args, { models, me }, info) => {
      if (!me) return;
      return models.Invoice.findAll({
        where: {
          customer_id: customer.id,
        },
      });
    },
    Reviews: async (customer, args, { models, me }, info) => {
      if (!me) return;
      return models.Review.findAll({
        where: {
          customer_id: customer.id,
        },
      });
    },
  },
};
