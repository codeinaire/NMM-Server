import { IResolverContext } from '../../types'
import { UserProfile} from '../types'

export default {
  Query: {
    me: async (
      _: any,
      __: any,
      { auth, dataSources, log }: IResolverContext
    ): Promise<any> => {
      const verifiedId = await dataSources.recipeAPI.context.auth.checkScopesAndResolve(
        dataSources.recipeAPI.context.event,
        ['profile']
      )
      console.log('AUTH DETAILS', verifiedId)
      return await dataSources.userAPI.findOrCreateUserProfile(verifiedId)
    }
  },
  Mutation: {
    createProfile: async (
      _: any,
      { id }: { id: string },
      { auth, dataSources, log }: IResolverContext
    ): Promise<UserProfile> => {
      const verifiedId = await dataSources.recipeAPI.context.auth.checkScopesAndResolve(
        dataSources.recipeAPI.context.event,
        ['profile']
      )
      console.log('This is USER RESOLVER', dataSources, id)
      const result = await dataSources.userAPI.createUserProfile(
        verifiedId
      )
      console.log('This is RESULT', result)
      return result
    }
  }
}
