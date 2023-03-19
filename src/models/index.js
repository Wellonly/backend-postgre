// import {Log} from './log';
import Sequelize, { DataTypes } from 'sequelize';

import user from './user';
import message from './message';
import category from './category';
import productCollection from './product_collection';
import collection from './collection';
import command from './command';
import invoice from './invoice';
import customer from './customer';
import product from './product';
import review from './review';
import setting from './setting';
import log from './log';
import link from './link';
import sublink from './sublink';
import carrier from './carrier';
import city from './city';
import office from './office';
import paymethod from './paymethod';
import option from './option';
import folder from './folder';

// CREATE SCHEMA IF NOT EXISTS ratest AUTHORIZATION postgres;

export const sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      schema: process.env.DATABASE_SCHEMA,
    },
);

export const models = {
  User: user(sequelize, DataTypes),
  Message: message(sequelize, DataTypes),
  Category: category(sequelize, DataTypes),
  ProductCollection: productCollection(sequelize, DataTypes),
  Collection: collection(sequelize, DataTypes),
  Command: command(sequelize, DataTypes),
  Invoice: invoice(sequelize, DataTypes),
  Customer: customer(sequelize, DataTypes),
  Product: product(sequelize, DataTypes),
  Review: review(sequelize, DataTypes),
  Setting: setting(sequelize, DataTypes),
  Log: log(sequelize, DataTypes),
  Link: link(sequelize, DataTypes),
  Sublink: sublink(sequelize, DataTypes),
  Carrier: carrier(sequelize, DataTypes),
  City: city(sequelize, DataTypes),
  Office: office(sequelize, DataTypes),
  Paymethod: paymethod(sequelize, DataTypes),
  Option: option(sequelize, DataTypes),
  Folder: folder(sequelize, DataTypes),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
