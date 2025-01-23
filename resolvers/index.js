import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.resolver.js';
import expenceResolver from './expence.resolver.js';
import orderResolver from './order.resolver.js';

const mergedResolvers = mergeResolvers([
  userResolver,
  expenceResolver,
  orderResolver,
]);
//sdf

export default mergedResolvers;
