import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Setting(id: ID!): Setting
    allSettings(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: SettingFilter): [Setting]
    _allSettingsMeta(page: Int, perPage: Int, filter: SettingFilter): ListMetadata
  }

  extend type Mutation {
    createSetting(id: ID!, configuration: JSON!): Setting
    updateSetting(id: ID!, configuration: JSON!): Setting
    removeSetting(id: ID!): Boolean
  }

  type Setting {
    id: ID!
    configuration: JSON
  }
  
  input SettingFilter {
    q: String
    ids: [ID]
    id: ID
    configuration: JSON
  }
  
`;