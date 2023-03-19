import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Paymethod(id: ID!): Paymethod
    allPaymethods(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PaymethodFilter): [Paymethod]
    _allPaymethodsMeta(page: Int, perPage: Int, filter: PaymethodFilter): ListMetadata
  }

  extend type Mutation {
    createPaymethod(title: String!, descript: String, icon: String, slug: String, calc: String, template: String, content: String, images: [ImageList], priority: Int): Paymethod
    updatePaymethod(id: ID!, title: String, descript: String, icon: String, slug: String, calc: String, template: String, content: String, images: [ImageList], priority: Int): Paymethod
    removePaymethod(id: ID!): Boolean
  }
  
  type Paymethod {
    id: ID
    priority: Int
    title: String
    descript: String
    icon: String
    slug: String
    calc: String
    images: String
    template: String
    content: String
  }
  
  input PaymethodFilter {
    q: String
    ids: [ID]
    id: ID
    title: String
    descript: String
    icon: String
    slug: String
    calc: String
    template: String
    content: String
    images: String
    priority: Int
    priority_gt: Int
  }
`;