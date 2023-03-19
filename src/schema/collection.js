import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Collection(id: ID!): Collection
    allCollections(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: CollectionFilter): [Collection]
    _allCollectionsMeta(page: Int, perPage: Int, filter: CollectionFilter): ListMetadata
  }

  extend type Mutation {
    createCollection(name: String!, slug: String, priority: Int): Collection
    updateCollection(id: ID!, name: String, slug: String, priority: Int, collection: [String]): Collection
    removeCollection(id: ID!): Boolean
  }
  
  type Collection {
    id: ID
    name: String
    slug: String
    priority: Int
    Products(limit: Int): [Product]
  }
  
  input CollectionFilter {
    q: String
    ids: [ID]
    id: ID
    name: String
    slug: String
    priority: Int
    priority_lte: Int
    priority_gt: Int
  }
`;