import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    City(id: ID!): City
    allCities(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: CityFilter): [City]
    _allCitiesMeta(page: Int, perPage: Int, filter: CityFilter): ListMetadata
  }

  extend type Mutation {
    createCity(name: String!, area: String, countryCode: String, phone: Int, postal: Int, latitude: Float, longitude: Float, rating: Int): City
    updateCity(id: ID!, name: String, area: String, countryCode: String, phone: Int, postal: Int, latitude: Float, longitude: Float, rating: Int): City
    removeCity(id: ID!): Boolean
  }
  
  type City {
    id: ID
    name: String    
    area: String
    countryCode: String
    phone: Int
    postal: Int
    latitude: Float
    longitude: Float
    rating: Int
    Offices: [Office]
  }
  
  input CityFilter {
    q: String
    ids: [ID]
    id: ID
    name: String
    area: String
    countryCode: String
    phone: Int
    postal: Int
    latitude: Float
    longitude: Float
    rating: Int
    rating_lt: Int
    rating_lte: Int
    rating_gt: Int
    rating_gte: Int
  }
`;