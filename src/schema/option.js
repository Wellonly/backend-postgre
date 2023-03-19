import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Option(id: ID!): Option
    allOptions(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: OptionFilter): [Option]
    _allOptionsMeta(page: Int, perPage: Int, filter: OptionFilter): ListMetadata
  }

  extend type Mutation {
    createOption(group: String, name: String, datatype: String, value: String, descript: String): Option
    updateOption(id: ID!, group: String, name: String, datatype: String, value: String, descript: String): Option
    removeOption(id: ID!): Boolean
  }
  
  type Option {
    id: ID
    group: String
    name: String
    datatype: String    
    value: String
    descript: String
  }
  
  input OptionFilter {
    q: String
    ids: [ID]
    id: ID
    group: String
    name: String
    datatype: String    
    value: String
    descript: String
  }
`;