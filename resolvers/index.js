import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.resolver.js';
import expenceResolver from './expence.resolver.js';
import orderResolver from './order.resolver.js';
import sharingResolver from './sharing.resolver.js';
import rawMaterialResolver from './rawMaterial.resolver.js';

const mergedResolvers = mergeResolvers([
  userResolver,
  expenceResolver,
  orderResolver,
  sharingResolver,
  rawMaterialResolver,
]);
//sdf

export default mergedResolvers;
