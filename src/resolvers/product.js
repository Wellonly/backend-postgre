// import { combineResolvers } from 'graphql-resolvers';
// import { AuthenticationError, UserInputError } from 'apollo-server';
// import { isAdmin, isAuthenticated } from './authorization';
import { countAllFiltered, findAllFiltered } from '../utils/ra-sequelize';
import { updateRecord, checkImagesAndArtImages, removeRecord, createRecord, readRecord } from './lib';
import { logError } from '../utils/logs';
import { models } from '../models';

export default {
  Query: {
    Product: (parent, args, { models, me }, info) => {
      return readRecord(me, models.Product, args);
    },
    // TODO: find out why this is not work...
    // allProducts: async (parent, args, { models, me }, info) => {
    //   return findAllFiltered(me, models.Product, args, (args?.filter?.collection) ? collectionArgHandler: undefined, [['priority', 'ASC']]);
    // },
    allProducts: async (parent, args, { models, me }, info) => {
      if (args.filter && args.filter.collection && !!me) {
        args.filter['ids'] = await models.ProductCollection.findAll({
              where: {collection_id: parseInt(args.filter.collection, 10)},
              limit: args.limit,
            })
        .then(recs => recs.map(rec => rec.productId))
        .catch( err => []);
      }
      return findAllFiltered(me, models.Product, args, undefined, [['priority', 'ASC']]);
    },
    _allProductsMeta: (parent, args, { models, me }, info) => {
      if (args.filter && args.filter.collection && !!me) {
        return { count: models.ProductCollection.count({ where: {collection_id: parseInt(args.filter.collection, 10)}})};
      }
      return { count: countAllFiltered(me, models.Product, args)};
    },
  },

  Mutation: {
    createProduct: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.Product, args, checkImagesAndArtImages);
    },

    updateProduct: (parent, args, { models, me }, info ) => {
      return updateRecord(me, models.Product, args, checkImagesAndArtImages);
    },

    removeProduct: (parent, args, { models, me }) => {
      return removeRecord(me, models.Product, args);
    },
  },

  Product: {
    Category: async (product, args, { models, me }, info) => {
      if (!me) return;
      return models.Category.findByPk(product.category_id);
    },
    Collections: async (product, args, { models, me }, info) => {
      if (!me) return;
      return product.getCollections();
    },
    Reviews: async (product, args, { models, me }, info) => {
      if (!me) return;
      return models.Review.findAll({
        where: {
          product_id: product.id,
        },
      });
    },
  },
};

// TODO: find out why this is not work...
// async function collectionArgHandler(me, model, args) {
//   console.log('...zv: collectionArgHandler:', args, args.filter);
//   args.filter['ids'] = await model.sequelize.models.product_collection.findAll({
//     where: {collection_id: parseInt(args.filter.collection, 10)},
//     limit: args.limit,
//   }).then(recs => recs.map(rec => rec.productId)).catch( err => {
//     logError(err, 'collectionArgHandler', args);
//     return [];
//   });
//   return !!me;
// }
