import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Category(id: ID!): Category
    allCategories(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: CategoryFilter): [Category]
    _allCategoriesMeta(page: Int, perPage: Int, filter: CategoryFilter): ListMetadata
  }

  extend type Mutation {
    createCategory(name: String!, slug: String, priority: Int): Category
    updateCategory(id: ID!, name: String, slug: String, priority: Int): Category
    removeCategory(id: ID!): Boolean
  }
  
  type Category {
    id: ID
    name: String
    slug: String
    priority: Int
    Products(limit: Int): [Product]
  }
  
  input CategoryFilter {
    q: String
    ids: [ID]
    id: ID
    name: String
    slug: String
    priority: Int
    priority_gt: Int
  }
`;