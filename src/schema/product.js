import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Product(id: ID!): Product
    allProducts(page: Int, perPage: Int, sortField: String, sortOrder: String, limit: Int, filter: ProductFilter): [Product]
    _allProductsMeta(page: Int, perPage: Int, limit: Int, filter: ProductFilter): ListMetadata
  }
  
  extend type Mutation {
    createProduct(category_id: ID!, sku: String!, title: String, slug: String, variant: String, priority: Int, highprice: Float, price: Float, optprice: Float, optfrom: Int, stock: Int, weight: Float, length: Float, width: Float, height: Float, video: String, images: [ImageList], description: String, artimages: [ImageList], article: String, spec: String): Product
    updateProduct(id: ID!, category_id: ID, sku: String, title: String, slug: String, variant: String, priority: Int, highprice: Float, price: Float, optprice: Float, optfrom: Int, stock: Int, weight: Float, length: Float, width: Float, height: Float, video: String, images: [ImageList], description: String, artimages: [ImageList], article: String, spec: String): Product
    removeProduct(id: ID!): Boolean
  }

  type Product {
    id: ID!
    category_id: ID
    sku: String
    title: String
    slug: String
    variant: String
    priority: Int
    highprice: Float
    price: Float
    optprice: Float
    optfrom: Int
    video: String
    images: String
    description: String
    stock: Int
    weight: Float
    length: Float
    width: Float
    height: Float
    spec: String
    artimages: String
    article: String
    Category: Category
    Collections: [Collection]
    Reviews: [Review]
  }
  
  input ImageList {
    name: String
    data: String
  }
  
  input ProductFilter {
    q: String
    ids: [ID]
    id: ID
    id_ne: ID
    category_id: ID
    sku: String
    title: String
    slug: String
    variant: String
    video: String
    images: String
    description: String
    spec: String
    artimages: String
    article: String
    collection: String
    priority: Int
    priority_gt: Int
    highprice: Float
    highprice_lt: Float
    highprice_lte: Float
    highprice_gt: Float
    highprice_gte: Float
    price: Float
    price_lt: Float
    price_lte: Float
    price_gt: Float
    price_gte: Float
    optprice: Float
    optprice_lt: Float
    optprice_lte: Float
    optprice_gt: Float
    optprice_gte: Float
    optfrom: Int
    optfrom_lt: Int
    optfrom_lte: Int
    optfrom_gt: Int
    optfrom_gte: Int
    stock: Int
    stock_lt: Int
    stock_lte: Int
    stock_gt: Int
    stock_gte: Int

    weight: Float
    weight_lt: Float
    weight_lte: Float
    weight_gt: Float
    weight_gte: Float

    length: Float
    length_lt: Float
    length_lte: Float
    length_gt: Float
    length_gte: Float

    width: Float
    width_lt: Float
    width_lte: Float
    width_gt: Float
    width_gte: Float

    height: Float
    height_lt: Float
    height_lte: Float
    height_gt: Float
    height_gte: Float
  }
`;