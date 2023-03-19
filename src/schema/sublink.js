import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Sublink(id: ID!): Sublink
    allSublinks(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: SublinkFilter): [Sublink]
    _allSublinksMeta(page: Int, perPage: Int, filter: SublinkFilter): ListMetadata
  }

  extend type Mutation {
    createSublink(label: String!, icon: String, slug: String, component: String, template: String, content: String, images: [ImageList], link_id: ID, priority: Int): Sublink
    updateSublink(id: ID!, label: String, icon: String, slug: String, component: String, template: String, content: String, images: [ImageList], link_id: ID, priority: Int): Sublink
    removeSublink(id: ID!): Boolean
  }
  
  type Sublink {
    id: ID
    link_id: ID
    priority: Int
    label: String    
    icon: String
    slug: String
    component: String
    images: String
    template: String
    content: String
  }
  
  input SublinkFilter {
    q: String
    ids: [ID]
    id: ID
    link_id: ID
    label: String
    icon: String
    slug: String
    component: String
    template: String
    content: String
    images: String
    priority: Int
    priority_gt: Int
  }
`;