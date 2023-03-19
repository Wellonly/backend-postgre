import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Link(id: ID!): Link
    allLinks(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: LinkFilter): [Link]
    _allLinksMeta(page: Int, perPage: Int, filter: LinkFilter): ListMetadata
  }

  extend type Mutation {
    createLink(menu: String, label: String!, icon: String, slug: String, component: String, template: String, content: String, images: [ImageList], priority: Int): Link
    updateLink(id: ID!, menu: String, label: String, icon: String, slug: String, component: String, template: String, content: String, images: [ImageList], priority: Int): Link
    removeLink(id: ID!): Boolean
  }
  
  type Link {
    id: ID
    menu: String
    priority: Int
    label: String    
    icon: String
    slug: String
    component: String
    images: String
    template: String
    content: String
    Sublinks(filter: SublinkFilter): [Sublink]
  }
  
  input LinkFilter {
    q: String
    ids: [ID]
    id: ID
    menu: String
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