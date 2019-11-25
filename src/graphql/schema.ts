import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
// TYPE DEFS
import Queries from './schema/queries';
import Mutations from './schema/mutations';
import Article from './schema/article';
import Recipe from './schema/recipe';
import UserProfile from './schema/userProfile';
// RESOLVERS
import articleResolvers from './resolvers/article';
import recipeResolvers from './resolvers/recipe';
import userProfileResolvers from './resolvers/userProfile';

export default makeExecutableSchema({
  typeDefs: [
    Queries,
    Mutations,
    Article,
    Recipe,
    UserProfile
  ],
  resolvers: merge(
    recipeResolvers,
    articleResolvers,
    userProfileResolvers
  )
});