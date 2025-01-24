const sharingTypeDef = `#graphql
  type Sharing {
    _id: ID!
    sharingDescription: String
    sharingPaymentType: String!
    sharingAmount: String!
    sharingDate: String!
    sharingCategoryType: String!
    userId: ID!
  }

  type Query {
    sharings: [Sharing!]!
    sharing(sharingId: ID!): Sharing
    categoryStatistics: [CategoryStatistics!]
  }

  type Mutation {
    createSharing(input: CreateSharingInput!): Sharing!
    updateSharing(input: UpdateSharingInput!): Sharing!
    deleteSharing(sharingId: ID!): Sharing!
  }

  input CreateSharingInput {
    sharingDescription: String
    sharingPaymentType: String!
    sharingAmount: Float!
    sharingDate: String
    sharingCategoryType: String!
  }

  input UpdateSharingInput {
    sharingId: ID!
    sharingDescription: String
    sharingPaymentType: String
    sharingAmount: Float
    sharingDate: String
    sharingCategoryType: String

  }
`;

export default sharingTypeDef;
