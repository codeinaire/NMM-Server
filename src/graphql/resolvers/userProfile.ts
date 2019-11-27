import { IResolverContext } from '../../types'
import { UserProfile } from '../types'

export default {
  Query: {
    me: async (
      _: any,
      { id }: { id: string },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        log.info(`Authorising user ${id}...`)
        const verifiedId = await auth.checkScopesAndResolve(
          event,
          ['profile']
        )
        log.info(`Authorisation of user ${id} successful!`)
        const userProfile = await dataSources.userAPI.findUserProfile(verifiedId)
        return userProfile
      } catch (error) {
        log.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  },
  Mutation: {
    createProfile: async (
      _: any,
      { id }: { id: string },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      const verifiedId = await auth.checkScopesAndResolve(
        event,
        ['profile']
      )
      console.log('This is USER RESOLVER', verifiedId)
      const result = await dataSources.userAPI.createUserProfile(
        verifiedId
      )
      console.log('This is RESULT', result)
      return result
    }
  }
}
