import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Customer(id: ID!): Customer
    allCustomers(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: CustomerFilter): [Customer]
    _allCustomersMeta(page: Int, perPage: Int, filter: CustomerFilter): ListMetadata
  }

  extend type Mutation {
    createCustomer(first_name: String!, last_name: String, email: String!, address: String, zipcode: String, city: String, avatar: String, birthday: String, first_seen: DateTime, last_seen: DateTime, has_ordered: Boolean, latest_purchase: String, has_newsletter: Boolean, groups: [String], nb_commands: Int, total_spent: Float): Customer
    updateCustomer(id: ID!, first_name: String, last_name: String, email: String, address: String, zipcode: String, city: String, avatar: String, birthday: String, first_seen: DateTime, last_seen: DateTime, has_ordered: Boolean, latest_purchase: String, has_newsletter: Boolean, groups: [String], nb_commands: Int, total_spent: Float): Customer
    removeCustomer(id: ID!): Boolean
  }

  type Customer {
    id: ID!
    first_name: String
    last_name: String
    email: String
    address: String
    zipcode: String
    city: String
    avatar: String
    birthday: String
    first_seen: DateTime
    last_seen: DateTime
    has_ordered: Boolean
    latest_purchase: String
    has_newsletter: Boolean
    groups: [String]
    nb_commands: Int
    total_spent: Float
    Commands: [Command]
    Invoices: [Invoice]
    Reviews: [Review]
  }
  
  input CustomerFilter {
    q: String
    ids: [ID]
    id: ID
    first_name: String
    last_name: String
    email: String
    address: String
    zipcode: String
    city: String
    avatar: String
    birthday: String
    first_seen: DateTime
    last_seen: DateTime
    has_ordered: Boolean
    latest_purchase: String
    has_newsletter: Boolean
    groups: [String]
    nb_commands: Int
    total_spent: Float
    first_seen_lt: DateTime
    first_seen_lte: DateTime
    first_seen_gt: DateTime
    first_seen_gte: DateTime
    last_seen_lt: DateTime
    last_seen_lte: DateTime
    last_seen_gt: DateTime
    last_seen_gte: DateTime
    nb_commands_lt: Int
    nb_commands_lte: Int
    nb_commands_gt: Int
    nb_commands_gte: Int
    total_spent_lt: Float
    total_spent_lte: Float
    total_spent_gt: Float
    total_spent_gte: Float
  }
  
`;