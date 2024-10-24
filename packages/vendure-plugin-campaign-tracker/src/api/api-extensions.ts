import gql from 'graphql-tag';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used by graphql codegen
const _scalars = gql`
  scalar DateTime
  scalar Money
  scalar PaginatedList
  type Order {
    id: ID
    code: String
    total: Money
  }
  enum SortOrder {
    ASC
    DESC
  }
`;

const commonApiExtensions = gql`
  type Campaign {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    name: String!
    metricsUpdatedAt: DateTime
    conversionLast7Days: Float
    revenueLast7days: Money
    revenueLast30days: Money
    revenueLast365Days: Money
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}

  extend type Mutation {
    """
    Add a campaign code to the current order.
    Creates a new active order if none exists.
    """
    addCampaignToOrder(campaignCode: String!): Order!
  }
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}

  type CampaignList {
    items: [Campaign!]!
    totalItems: Int
  }

  input CampaignInput {
    code: String!
    name: String!
  }

  input CampaignSortParameter {
    createdAt: SortOrder
    updatedAt: SortOrder
    code: SortOrder
    name: SortOrder
    conversionLast7Days: SortOrder
    revenueLast7days: SortOrder
    revenueLast30days: SortOrder
    revenueLast365Days: SortOrder
  }

  input CampaignListOptions {
    skip: Int
    take: Int
    sort: CampaignSortParameter
  }

  extend type Mutation {
    createCampaign(input: CampaignInput!): Campaign!
    updateCampaign(id: ID!, input: CampaignInput!): Campaign!
    deleteCampaign(id: ID!): Boolean!
  }

  extend type Query {
    campaigns(options: CampaignListOptions): CampaignList!
  }
`;
