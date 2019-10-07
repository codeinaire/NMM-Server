import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
// TYPE DEFS
import Queries from './schema/queries';
import Mutations from './schema/mutations';
import Article from './schema/article';
import Recipe from './schema/recipe';
// RESOLVERS
import articleResolvers from './resolver/article';
import recipeResolvers from './resolver/recipe';

export default makeExecutableSchema({
  typeDefs: [
    Queries,
    Mutations,
    Article,
    Recipe
  ],
  resolvers: merge(
    recipeResolvers,
    articleResolvers
  )
});