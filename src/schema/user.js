import { gql } from 'apollo-server-express';

//TODO: remove: user, users in flavour: User, allUsers
// user(id: ID!): User
// users: [User!]

export default gql`
  extend type Query {
    User(id: ID!): User
    allUsers(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: UserFilter): [User]
    _allUsersMeta(page: Int, perPage: Int, filter: UserFilter): ListMetadata
    func(id: ID!): Token
    me: User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token
    signIn(id: ID!, login: String!, password: String!): Token
    logout(id: ID!): Token
    update(id: ID!, data: String!): Token

    createUser(username: String!, email: String, phone: String, email2: String, phone2: String, role: String, descript: String, priority: Int): User
    updateUser(id: ID!, username: String, email: String, phone: String, email2: String, phone2: String, role: String, descript: String, priority: Int): User
    removeUser(id: ID!): Boolean
  }

  type Token {
    token: String
  }

  type User {
    id: ID!
    priority: Int
    username: String!
    email: String
    phone: String
    email2: String
    phone2: String
    role: String
    descript: String
    Messages(limit: Int): [Message]
    Folders(limit: Int): [Folder]
  }

  input UserFilter {
    q: String
    id: ID
    ids: [ID]
    username: String
    email: String
    phone: String
    email2: String
    phone2: String
    role: String
    descript: String
    priority: Int
    priority_gt: Int
  }
`;
