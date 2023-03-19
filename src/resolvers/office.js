// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
import { countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, checkImages, removeRecord, createRecord, readRecord } from './lib';
import { isAuthorizedAsAdmin } from './authorization';

export default {
  Query: {
    Office: (parent, args, { models, me }, info) => {
      return readRecord(me, models.Office, args);
    },
    allOffices: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Office, args, undefined, [['priority', 'ASC']]);
    },
    _allOfficesMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Office, args) };
    },
  },
  Mutation: {
    createOffice: (parent, args, { models, me }, info) => {
      return createRecord(me, models.Office, args, checkImages);
    },
    updateOffice: (parent, args, { models, me }, info) => {
      return updateRecord(me, models.Office, args, checkImages);
    },
    removeOffice: (parent, args, { models, me }) => {
      return removeRecord(me, models.Office, args, isAuthorizedAsAdmin);
    },
  },
  Office: {
    City: (office, args, { models, me }, info) => {
      if (!me) return;
      return models.City.findByPk(office.city_id);
    },
  },
}
