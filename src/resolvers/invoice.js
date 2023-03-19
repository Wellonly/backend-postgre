// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

export default {
  Query: {
    Invoice: (parent, args, { models, me }) => {
      return readRecord(me, models.Invoice, args);
    },
    allInvoices: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Invoice, args);
    },
    _allInvoicesMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Invoice, args)};
    },
  },

  Mutation: {
    createInvoice: (parent, args, { models, me }, info ) => {
      if (!args.date) args.date = new Date();
      return createRecord(me, models.Invoice, args);
    },

    updateInvoice: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Invoice, args);
    },

    removeInvoice: (parent, args, { models, me }) => {
      return removeRecord(me, models.Invoice, args);
    },
  },

  Invoice: {
    Command: async (invoice, args, { models, me }, info) => {
      if (!me) return;
      return models.Command.findByPk(invoice.command_id);
    },
    Customer: async (invoice, args, { models, me }, info) => {
      if (!me) return;
      return models.Customer.findByPk(invoice.customer_id);
    },
  },
};
