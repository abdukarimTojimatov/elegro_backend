const expenceTypeDef = `#graphql
  type Expence {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
    user: User
  }

  type Query {
    expences: [Expence!]
    expence(expenceId:ID!): Expence
    categoryStatistics: [CategoryStatistics!]
  }

  type Mutation {
    createExpence(input: CreateExpenceInput!): Expence!
    updateExpence(input: UpdateExpenceInput): Expence
    deleteExpence(ExpenceId:ID!): Expence!
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input CreateExpenceInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    date: String!
    location: String
  }

  input UpdateExpenceInput {
    ExpenceId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    location: String
    date: String
  }
`;

export default expenceTypeDef;
