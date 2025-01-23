const orderTypeDef = `#graphql
  type Order {
    # Core fields
    _id: ID!
    orderAutoNumber: String
    orderName: String!
    orderCategory: String!
    orderType: String!
    date: String!
    orderReadyDate: String!
    # Customer information
    userId: ID!
    orderCustomerName: String!
    orderCustomerPhoneNumber: String
    orderLocation: String
    orderStatus: String!
    
    # Order details
    orderDescription: String!
    
    # Financial information
    orderPaymentStatus: String!
    orderTotalAmount: Float!
    orderTotalPaid: Float!
    orderTotalDebt: Float!
    orderExpensesAmount: Float
    orderExpensesDescription: String
    orderPayments: [OrderPayment]
  }

  type OrderPayment {
    paymentType: String!
    amount: Float!
    date: String!
  }

  type Query {
    orders: [Order!]!
    order(orderId: ID!): Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(input: UpdateOrderInput!): Order!
    deleteOrder(orderId: ID!): Order!
  }

  input OrderPaymentInput {
    paymentType: String
    amount: Float
    date: String
  }

  input CreateOrderInput {
    orderName: String!
    orderCustomerName: String!
    orderCustomerPhoneNumber: String
    orderDescription: String!
    orderCategory: String!
    orderType: String!
    orderPaymentStatus: String!
    orderTotalAmount: Float!
    orderExpensesAmount: Float
    orderReadyDate: String!
    orderTotalPaid: Float!
    orderTotalDebt: Float!
    orderExpensesDescription: String
    orderLocation: String
    orderPayments: [OrderPaymentInput]
  }

  input UpdateOrderInput {
    orderId: ID!
    orderName: String
    orderCustomerName: String
    orderCustomerPhoneNumber: String
    orderDescription: String
    orderCategory: String
    orderType: String
    orderPaymentStatus: String
    orderTotalAmount: Float
    orderReadyDate: String
    orderExpensesAmount: Float
    orderTotalPaid: Float
    orderTotalDebt: Float
    orderExpensesDescription: String
    orderLocation: String
    orderStatus: String
    orderPayments: [OrderPaymentInput]
  }
`;

export default orderTypeDef;
