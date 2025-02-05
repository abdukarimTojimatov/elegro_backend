const orderTypeDef = `#graphql
type Order {
  _id: ID!
  userId: ID!
  orderName: String!
  orderDescription: String
  orderTotalAmount: Float!
  orderStatus: String!
  date: String
}

type PaginatedOrders {
  docs: [Order]
  totalDocs: Int
  limit: Int
  totalPages: Int
  page: Int
  hasPrevPage: Boolean
  hasNextPage: Boolean
}

type Query {
  getOrders(page: Int, limit: Int): PaginatedOrders
  getOrder(id: ID!): Order
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order
  updateOrder(input: UpdateOrderInput!): Order
  deleteOrder(orderId: ID!): Order
}

input CreateOrderInput {
  userId: ID
  orderName: String
  orderDescription: String
  orderTotalAmount: Float
}

input UpdateOrderInput {
  _id: ID!
  orderName: String
  orderDescription: String
  orderTotalAmount: Float
}`;

export default orderTypeDef;
