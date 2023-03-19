// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, removeRecord, readRecord, createRecord } from './lib';

export default {
  Query: {
    City: (parent, args, { models, me }) => {
      return readRecord(me, models.City, args);
    },
    allCities: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.City, args);
    },
    _allCitiesMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.City, args)}; 
    },
  },

  Mutation: {
    createCity: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.City, args);
    },

    updateCity: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.City, args);
    },

    removeCity: (parent, args, { models, me }) => {
      return removeRecord(me, models.City, args);
    },
  },

  City: {
    Offices: async (city, args, { models, me }, info) => {
      if (!me) return;
      const { limit } = args;
      return models.Office.findAll({
        where: {
          city_id: city.id,
        },
        limit: (isNaN(+limit) ? null: +limit),
        order: [['priority', 'ASC']],
      });
    },
  },
};
