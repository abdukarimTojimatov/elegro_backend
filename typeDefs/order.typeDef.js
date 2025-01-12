const orderTypeDef = `#graphql
  type Order {
    _id: ID!
    userId: ID!
    orderAutoNumber: String
    orderName: String!
    orderCustomerName: String!
    orderCustomerPhoneNumber: String
    orderDescription: String!
    orderCategory: String!
    orderType: String!
    orderPaymentStatus: String!
    orderTotalAmount: Float!
    orderExpensesAmount: Float
    orderTotalPaid: Float
    orderTotalDebt: Float
    orderExpensesDescription: String
    orderLocation: String
    orderPayments: [OrderPayment]
    date: String!
  }

  type OrderPayment {
    paymentType: String
    amount: Float
    date: String
  }

  type Query {
    orders: [Order!]
    order(orderId: ID!): Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(input: UpdateOrderInput!): Order!
    deleteOrder(orderId: ID!): Order!
  }

  input CreateOrderInput {
    orderName: String!
    orderCustomerName: String!
    orderCustomerPhoneNumber: String
    orderDescription: String
    orderCategory: String!
    orderType: String!
    orderPaymentStatus: String
    orderTotalAmount: Float!
    orderExpensesAmount: Float
    orderTotalPaid: Float
    orderTotalDebt: Float
    orderExpensesDescription: String
    orderLocation: String
    orderPayments: [CreateOrderPaymentInput]
  }

  input UpdateOrderInput {
    _id: ID!
    orderId: ID!
    orderAutoNumber: String!
    orderName: String!
    orderCustomerName: String!
    orderCustomerPhoneNumber: String
    orderDescription: String
    orderCategory: String!
    orderType: String!
    orderPaymentStatus: String!
    orderTotalAmount: Float
    orderExpensesAmount: Float
    orderTotalPaid: Float
    orderTotalDebt: Float
    orderExpensesDescription: String
    orderLocation: String
    orderPayments: [UpdateOrderPaymentInput]
  }

  input CreateOrderPaymentInput {
    paymentType: String
    amount: Float
    date: String
  }

  input UpdateOrderPaymentInput {
    paymentType: String
    amount: Float
    date: String
  }
`;

export default orderTypeDef;
