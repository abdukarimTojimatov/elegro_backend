const rawMaterialTypeDef = `#graphql
type RawMaterial {
  _id: ID!
  userId: ID!
  customerName: String!
  phoneNumber: String
  rawMaterialName: String!
  rawMaterialDescription: String
  rawMaterialQuantity: Float!
  unitOfMeasurement: String!
  rawMaterialPrice: Float!
  payments: [Payment]
  rawMaterialTotalPrice: Float!
  totalPaid: Float
  totalDebt: Float
  date: String
}

type Payment {
  paymentType: String
  amount: Float
  date: String
}

type PaginatedRawMaterials {
  docs: [RawMaterial]
  totalDocs: Int
  limit: Int
  totalPages: Int
  page: Int
  hasPrevPage: Boolean
  hasNextPage: Boolean
}

type Query {
  getRawMaterials(page: Int, limit: Int): PaginatedRawMaterials
  getRawMaterial(id: ID!): RawMaterial
}

type Mutation {
  createRawMaterial(input: CreateRawMaterialInput!): RawMaterial
  updateRawMaterial(input: UpdateRawMaterialInput!): RawMaterial
  deleteRawMaterial(createRawMaterialId: ID!): RawMaterial
}

input CreateRawMaterialInput {
  userId: ID
  rawMaterialName: String
  rawMaterialDescription: String
  rawMaterialQuantity: Float
  customerName: String
  phoneNumber: String
  unitOfMeasurement: String
  rawMaterialPrice: Float
  payments: [PaymentInput]
}

input UpdateRawMaterialInput {
  _id: ID!
  rawMaterialName: String
  customerName: String
  phoneNumber: String
  rawMaterialDescription: String
  rawMaterialQuantity: Float
  unitOfMeasurement: String
  rawMaterialPrice: Float
  payments: [PaymentInput]
}

input PaymentInput {
  paymentType: String
  amount: Float
  date: String
}`;

export default rawMaterialTypeDef;
