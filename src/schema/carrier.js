import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Carrier(id: ID!): Carrier
    allCarriers(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: CarrierFilter): [Carrier]
    _allCarriersMeta(page: Int, perPage: Int, filter: CarrierFilter): ListMetadata
  }

  extend type Mutation {
    createCarrier(title: String!, descript: String, icon: String, slug: String, calc: String, template: String, content: String, images: [ImageList], priority: Int): Carrier
    updateCarrier(id: ID!, title: String, descript: String, icon: String, slug: String, calc: String, template: String, content: String, images: [ImageList], priority: Int): Carrier
    removeCarrier(id: ID!): Boolean
  }
  
  type Carrier {
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
  
  input CarrierFilter {
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