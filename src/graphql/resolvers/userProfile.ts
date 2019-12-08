import { IResolverContext } from '../../types'
import { UserProfile, UserProfileInput } from '../types'

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
        log.info(`Authorisation of user ${verifiedId} successful!`)
        const userProfile = await dataSources.userProfileAPI.findUserProfile(verifiedId)
        return userProfile
      } catch (error) {
        log.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  },
  Mutation: {
    createUserProfile: async (
      _: any,
      { userProfileInput }: { userProfileInput: UserProfileInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        log.info(`Authorising user ${userProfileInput.id}...`)
        const verifiedId = await auth.checkScopesAndResolve(
          event,
          ['profile']
        )
        log.info(`Authorisation of user ${userProfileInput.id} successful!`)

        log.info(`Creating profile for user ${verifiedId}...`)
        const createdUserProfile = await dataSources.userProfileAPI.createUserProfile(userProfileInput, 'createUserProfile')

        log.info(`User profile for ${createdUserProfile.id} created.`)
        return createdUserProfile
      } catch (error) {
        log.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  }
}
