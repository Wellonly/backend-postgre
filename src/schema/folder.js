import { gql } from 'graphql-tag'; //'apollo-server-express';

export default gql`
  extend type Query {
    Folder(id: ID!): Folder
    allFolders(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: FolderFilter): [Folder]
    _allFoldersMeta(page: Int, perPage: Int, filter: FolderFilter): ListMetadata
  }

  extend type Mutation {
    createFolder(name: String!, place: Int, icon: String, color: String, slug: String, filter: String, user_id: ID, priority: Int): Folder
    updateFolder(id: ID!, name: String, icon: String, color: String, slug: String, filter: String, user_id: ID, priority: Int): Folder
    removeFolder(id: ID!): Boolean
  }
  
  type Folder {
    id: ID
    user_id: ID
    place: Int
    priority: Int
    name: String    
    icon: String
    color: String
    slug: String
    filter: String
    User(include: Boolean): User
    Messages(limit: Int): [Message]
  }
  
  input FolderFilter {
    q: String
    id: ID
    ids: [ID]
    user_id: ID
    user_id_or: [ID]
    place: Int
    place_or: [Int]
    place_gt: Int
    name: String
    icon: String
    color: String
    slug: String
    filter: String
    priority: Int
    priority_gt: Int
    metrics: String
  }
`;