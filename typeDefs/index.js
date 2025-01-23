import { mergeTypeDefs } from '@graphql-tools/merge';

import userTypeDef from './user.typeDef.js';
import expenceTypeDef from './expence.typeDef.js';
import orderTypeDef from './order.typeDef.js';
import sharingTypeDef from './sharing.typeDef.js';
const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  expenceTypeDef,
  orderTypeDef,
  sharingTypeDef,
]);

export default mergedTypeDefs;
