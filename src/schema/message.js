import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Message(id: ID!): Message
    allMessages(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: MessageFilter): [Message]
    _allMessagesMeta(page: Int, perPage: Int, filter: MessageFilter): ListMetadata
  }

  extend type Mutation {
    createMessage(to_id: ID, sentAt: DateTime, readAt: DateTime, inbox_id: ID, folder_id: ID, title: String, text: String): Message
    updateMessage(id: ID!, sentAt: DateTime, readAt: DateTime, inbox_id: ID, folder_id: ID, to_id: ID, title: String, text: String): Message
    removeMessage(id: ID!): Boolean
  }

  type Message {
    id: ID!
    user_id: ID!
    folder_id: ID
    to_id: ID
    inbox_id: ID
    title: String
    text: String
    createdAt: DateTime
    updatedAt: DateTime
    sentAt: DateTime
    readAt: DateTime
    User(include: Boolean): User
    ToUser(include: Boolean): User
    UserFolder(include: Boolean): Folder
    InboxFolder(include: Boolean): Folder
  }

  extend type Subscription {
    messageCreated(forId: ID): Message
  }

  input MessageFilter {
    q: String
    id: ID
    user: Int
    folder: Int
    title: String
    text: String
    sentAt: DateTime
    sentAt_lt: DateTime
    sentAt_lte: DateTime
    sentAt_gt: DateTime
    sentAt_gte: DateTime
    readAt: DateTime
    readAt_lt: DateTime
    readAt_lte: DateTime
    readAt_gt: DateTime
    readAt_gte: DateTime
    createdAt: DateTime
    createdAt_lt: DateTime
    createdAt_lte: DateTime
    createdAt_gt: DateTime
    createdAt_gte: DateTime
    updatedAt: DateTime
    updatedAt_lt: DateTime
    updatedAt_lte: DateTime
    updatedAt_gt: DateTime
    updatedAt_gte: DateTime
  }
`;

/*
    // ids: [ID]
    // user_id: ID
    // user_id_or: [ID]
    // folder_id: ID
    // to_id: ID
    // to_id_or: [ID]
    // inbox_id: ID
*/