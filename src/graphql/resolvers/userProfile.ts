import { IResolverContext } from '../../types'
import { UserProfile, UserProfileInput } from '../types';

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
        const userProfile = await dataSources.userProfileAPI.findUserProfile(id)
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
      { userProfile }: { userProfile: UserProfileInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        log.info(`Authorising user ${userProfile.id}...`)
        const verifiedId = await auth.checkScopesAndResolve(
          event,
          ['profile']
        )
        log.info(`Authorisation of user ${userProfile.id} successful!`)
        log.info(`Creating profile for user ${verifiedId}...`)
        const createdUserProfile = await dataSources.userProfileAPI.createUserProfile(userProfile)
        log.info(`User profile for ${createdUserProfile.id} created.`)
        return createdUserProfile
      } catch (error) {
        log.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  }
}
