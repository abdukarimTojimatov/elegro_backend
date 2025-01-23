import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.resolver.js';
import expenceResolver from './expence.resolver.js';
import orderResolver from './order.resolver.js';
import sharingResolver from './sharing.resolver.js';

const mergedResolvers = mergeResolvers([
  userResolver,
  expenceResolver,
  orderResolver,
  sharingResolver,
]);
//sdf

export default mergedResolvers;
