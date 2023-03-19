import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Invoice(id: ID!): Invoice
    allInvoices(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: InvoiceFilter): [Invoice]
    _allInvoicesMeta(page: Int, perPage: Int, filter: InvoiceFilter): ListMetadata
  }

  extend type Mutation {
    createInvoice(id: ID!, date: DateTime!, command_id: ID!, customer_id: ID!, total_ex_taxes: Float, delivery_fees: Float, tax_rate: Float, taxes: Float, total: Float): Invoice
    updateInvoice(id: ID!, date: DateTime, command_id: ID, customer_id: ID, total_ex_taxes: Float, delivery_fees: Float, tax_rate: Float, taxes: Float, total: Float): Invoice
    removeInvoice(id: ID!): Boolean
  }
  
  type Invoice {
    id: ID!
    date: DateTime
    command_id: ID
    customer_id: ID
    total_ex_taxes: Float
    delivery_fees: Float
    tax_rate: Float
    taxes: Float
    total: Float
    Command: Command
    Customer: Customer
  }
  
  input InvoiceFilter {
    q: String
    ids: [ID]
    id: ID
    date: DateTime
    command_id: ID
    customer_id: ID
    total_ex_taxes: Float
    delivery_fees: Float
    tax_rate: Float
    taxes: Float
    total: Float
    date_lt: DateTime
    date_lte: DateTime
    date_gt: DateTime
    date_gte: DateTime
    total_ex_taxes_lt: Float
    total_ex_taxes_lte: Float
    total_ex_taxes_gt: Float
    total_ex_taxes_gte: Float
    delivery_fees_lt: Float
    delivery_fees_lte: Float
    delivery_fees_gt: Float
    delivery_fees_gte: Float
    tax_rate_lt: Float
    tax_rate_lte: Float
    tax_rate_gt: Float
    tax_rate_gte: Float
    taxes_lt: Float
    taxes_lte: Float
    taxes_gt: Float
    taxes_gte: Float
    total_lt: Float
    total_lte: Float
    total_gt: Float
    total_gte: Float
  }
  
`;