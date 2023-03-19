// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { filter2where, findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, checkImages, removeRecord, readRecord, createRecord } from './lib';

export default {
  Query: {
    Carrier: (parent, args, { models, me }) => {
      return readRecord(me, models.Carrier, args);
    },
    allCarriers: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Carrier, args, undefined, [['priority', 'ASC']]);
    },
    _allCarriersMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Carrier, args)};
    },
  },

  Mutation: {
    createCarrier: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Carrier, args, checkImages);
    },

    updateCarrier: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Carrier, args, checkImages);
    },

    removeCarrier: (parent, args, { models, me }) => {
      return removeRecord(me, models.Carrier, args);
    },
  },
};
