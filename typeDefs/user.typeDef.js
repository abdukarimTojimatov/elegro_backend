const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    password: String!
    phoneNumber: String!
    expenses: [Expense!]
    sharings: [Sharing!]
  }

  type Query {
    authUser: User
    user(userId:ID!): User
    users: [User!]!
  }


  type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
  }

  input SignUpInput {
    username: String!
    password: String
    phoneNumber: String!
  }

  input LoginInput {
    phoneNumber: String!
    password: String!
  }

  type LogoutResponse {
    message: String!
  }
`;

export default userTypeDef;
