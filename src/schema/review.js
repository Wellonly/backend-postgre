import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Review(id: ID!): Review
    allReviews(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: ReviewFilter): [Review]
    _allReviewsMeta(page: Int, perPage: Int, filter: ReviewFilter): ListMetadata
  }

  extend type Mutation {
    createReview(status: String!, command_id: ID!, product_id: ID!, customer_id: ID!, rating: Int, comment: String!): Review
    updateReview(id: ID!, date: DateTime, status: String, command_id: ID, product_id: ID, customer_id: ID, rating: Int, comment: String): Review
    removeReview(id: ID!): Boolean
  }

  type Review {
    id: ID!
    date: DateTime
    status: String
    command_id: ID
    product_id: ID
    customer_id: ID
    rating: Int
    comment: String
    Command: Command
    Product: Product
    Customer: Customer
  }
  
  input ReviewFilter {
    q: String
    ids: [ID]
    id: ID
    date: DateTime
    status: String
    command_id: ID
    product_id: ID
    customer_id: ID
    rating: Int
    comment: String
    date_lt: DateTime
    date_lte: DateTime
    date_gt: DateTime
    date_gte: DateTime
    rating_lt: Int
    rating_lte: Int
    rating_gt: Int
    rating_gte: Int
  }
  
`;