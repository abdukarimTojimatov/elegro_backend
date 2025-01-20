import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.resolver.js';
import transactionResolver from './transaction.resolver.js';
import orderResolver from './order.resolver.js';

const mergedResolvers = mergeResolvers([
  userResolver,
  transactionResolver,
  orderResolver,
]);
//sdf

export default mergedResolvers;
