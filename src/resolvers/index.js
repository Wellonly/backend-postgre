import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import categoryResolvers from './category';
import collectionResolvers from './collection';
import commandResolvers from './command';
import invoiceResolvers from './invoice';
import customerResolvers from './customer';
import productResolvers from './product';
import reviewResolvers from './review';
import settingResolvers from './setting';
import logResolvers from './log';
import linkResolvers from './link';
import sublinkResolvers from './sublink';
import carrierResolvers from './carrier';
import cityResolvers from './city';
import officeResolvers from './office';
import paymethodResolvers from './paymethod';
import optionResolvers from './option';
import folderResolvers from './folder';

const customScalarResolver = {
  DateTime: GraphQLDateTime,
};

export const resolvers = [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  categoryResolvers,
  collectionResolvers,
  commandResolvers,
  invoiceResolvers,
  customerResolvers,
  productResolvers,
  reviewResolvers,
  settingResolvers,
  logResolvers,
  linkResolvers,
  sublinkResolvers,
  carrierResolvers,
  cityResolvers,
  officeResolvers,
  paymethodResolvers,
  optionResolvers,
  folderResolvers,
];
