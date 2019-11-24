import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
// TYPE DEFS
import Queries from './schema/queries';
import Mutations from './schema/mutations';
import Article from './schema/article';
import Recipe from './schema/recipe';
import UserProfilefrom './schema/user';
// RESOLVERS
import articleResolvers from './resolvers/article';
import recipeResolvers from './resolvers/recipe';
import userResolvers from './resolvers/user';

export default makeExecutableSchema({
  typeDefs: [
    Queries,
    Mutations,
    Article,
    Recipe,
    User
  ],
  resolvers: merge(
    recipeResolvers,
    articleResolvers,
    userResolvers
  )
});