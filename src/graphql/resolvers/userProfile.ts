import { IResolverContext } from '../../types'
import { UserProfile, UserProfileInput } from '../types'
import { GraphQLResolveInfo } from 'graphql'

export default {
  Query: {
    me: async (
      _: any,
      { id }: { id: string },
      { auth, dataSources, log, event }: IResolverContext,
      info: GraphQLResolveInfo
    ): Promise<UserProfile> => {
      console.log('info', info);

      try {
        log.info(`Authorising user ${id}...`)
        const verifiedId = await auth.checkScopesAndResolve(
          event,
          ['profile']
        )
        log.info(`Authorisation of user ${verifiedId} successful!`)
        const userProfile = await dataSources.userProfileAPI.findUserProfile(verifiedId, info.fieldName)
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
      { auth, dataSources, log, event }: IResolverContext,
      info: GraphQLResolveInfo
    ): Promise<UserProfile> => {
      try {
        // log.info(`Authorising user ${userProfile.id}...`)
        // const verifiedId = await auth.checkScopesAndResolve(
        //   event,
        //   ['profile']
        // )
        // log.info(`Authorisation of user ${userProfile.id} successful!`)

        // log.info(`Creating profile for user ${verifiedId}...`)
        const createdUserProfile = await dataSources.userProfileAPI.createUserProfile(userProfile, info.fieldName)

        log.info(`User profile for ${createdUserProfile.id} created.`)
        return createdUserProfile
      } catch (error) {
        log.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  }
}
