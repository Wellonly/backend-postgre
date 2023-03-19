// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import {  } from './authorization';
import { findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { logError } from "../utils/logs";
import { createRecord, updateRecord, removeRecord, readRecord } from './lib';

export default {
  Query: {
    Collection: (parent, args, { models, me }) => {
      return readRecord(me, models.Collection, args);
    },
    allCollections: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.Collection, args, undefined, [['priority', 'ASC']]);
    },
    _allCollectionsMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.Collection, args)};
    },
  },

  Mutation: {
    createCollection: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Collection, args);
    },

    updateCollection: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Collection, args, updateCollectionCB);
    },

    removeCollection: (parent, args, { models, me }) => {
      return removeRecord(me, models.Collection, args);
    },
  },

  Collection: {
    Products: async (collection, args, { models, me }, info) => {
      if (!me) return;
      return collection.getProducts({...args, order:[['priority', 'ASC']]});
    },
  },
};

function updateCollectionCB(me, targetCollection, args) {
    const { collection } = args;
    // console.log('zv updateCollection: targetCollection, { id, name, collection }:', targetCollection, { id, name, collection });
    if (Array.isArray(collection)) {
      const result = targetCollection.setProducts(collection.map(prodId => parseInt(prodId, 10))).then(res => {
        return res;
      }).catch(err => {
        logError(err, 'collection.setProducts', args, targetCollection);
        return false
      });
      return !!result
    }
    return true;
}
