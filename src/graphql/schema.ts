import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

import Article from './schema/article';
import articleResolvers from './resolver/index';

export default makeExecutableSchema({
  typeDefs: [ Article ],
  resolvers: merge(articleResolvers)
});