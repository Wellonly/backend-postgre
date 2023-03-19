import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import categorySchema from './category';
import collectionSchema from './collection';
import commandSchema from './command';
import invoiceSchema from './invoice';
import customerSchema from './customer';
import productSchema from './product';
import reviewSchema from './review';
import settingSchema from './setting';
import logSchema from './log';
import linkSchema from './link';
import sublinkSchema from './sublink';
import carrierSchema from './carrier';
import citySchema from './city';
import officeSchema from './office';
import paymethodSchema from './paymethod';
import optionSchema from './option';
import folderSchema from './folder';

const mainSchema = gql`
"""Date type"""
  scalar DateTime
  
  """
  The JSON scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
  """
  scalar JSON

  type ListMetadata {
    count: Int
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
  
  """An object with an ID"""
  interface Node {
    """The id of the object."""
    id: ID!
  }

`;

export const schemas = [
  mainSchema,
  userSchema,
  messageSchema,
  categorySchema,
  collectionSchema,
  commandSchema,
  invoiceSchema,
  customerSchema,
  productSchema,
  reviewSchema,
  settingSchema,
  logSchema,
  linkSchema,
  sublinkSchema,
  carrierSchema,
  citySchema,
  officeSchema,
  paymethodSchema,
  optionSchema,
  folderSchema,
];
