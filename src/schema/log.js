import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    logs(cursor: String, limit: Int): LogConnection!
    Log(id: ID!): Log
  }

  extend type Mutation {
    createLog(id: ID, path: String, message: String): Token
  }

  type LogConnection {
    edges: [Log!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Log {
    id: ID!
    path: String
    message: String
    createdAt: DateTime
  }

  extend type Subscription {
    logCreated: Log!
  }
`;
