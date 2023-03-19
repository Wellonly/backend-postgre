import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Office(id: ID!): Office
    allOffices(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: OfficeFilter): [Office]
    _allOfficesMeta(page: Int, perPage: Int, filter: OfficeFilter): ListMetadata
  }

  extend type Mutation {
    createOffice(city_id: ID, title: String!, priority: Int, services: Int, descript: String, address: String, slug: String, address: String, latitude: Float, longitude: Float, worktime: String, phone: String, template: String, content: String, images: [ImageList]): Office
    updateOffice(id: ID!, city_id: ID, title: String, priority: Int, services: Int, descript: String, address: String, slug: String, address: String, latitude: Float, longitude: Float, worktime: String, phone: String, template: String, content: String, images: [ImageList]): Office
    removeOffice(id: ID!): Boolean
  }
  
  type Office {
    id: ID
    city_id: ID
    priority: Int
    services: Int
    title: String
    descript: String
    address: String
    latitude: Float
    longitude: Float
    worktime: String
    phone: String
    slug: String
    images: String
    template: String
    content: String
    City: City
  }
  
  input OfficeFilter {
    q: String
    ids: [ID]
    id: ID
    city_id: ID
    title: String
    descript: String
    address: String
    latitude: Float
    longitude: Float
    worktime: String
    phone: String
    slug: String
    images: String
    template: String
    content: String
    services: Int
    priority: Int
    priority_gt: Int
  }
`;