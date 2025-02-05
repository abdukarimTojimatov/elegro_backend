import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.resolver.js';
import expenseResolver from './expense.resolver.js';
import orderResolver from './order.resolver.js';
import sharingResolver from './sharing.resolver.js';
import rawMaterialResolver from './rawMaterial.resolver.js';

const mergedResolvers = mergeResolvers([
  userResolver,
  expenseResolver,
  orderResolver,
  sharingResolver,
  rawMaterialResolver,
]);
//sdf

export default mergedResolvers;
