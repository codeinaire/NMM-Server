import { Challenge, ChallengeInput } from '../types'
import { IResolverContext } from '../../types'

export default {
  Query: {
    challenge: async (
      _: any,
      __: any,
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<Challenge> => {
      log.info('Finding challenge')
      const challenge = await dataSources.challengeAPI.findChallenge()
      log.info('Found challenge')
      return challenge
    }
  },
  Mutation: {
    createOrUpdateChallenge: async (
      _: any,
      { challengeInput }: { challengeInput: ChallengeInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<Challenge> => {
      try {
        // log.info(`Authorising user to create challenge...`)
        // const verifiedId = await auth.checkScopesAndResolve(event, ['profile'])
        // log.info(`Authorisation of user ${verifiedId} successful!`)

        // log.info(`Creating challenge for ${verifiedId}`)
        const createdChallenge = await dataSources.challengeAPI.createChallenge(
          challengeInput,
          challengeInput.type,
          '1'
        )
        log.info('Challenge created')
        return createdChallenge
      } catch (error) {
        log.error(`Couldn't create challenge: ${error}`)
        return error
      }
    }
  },
  ChallengeDifficultyEnum: {
    Easy: 1,
    Medium: 1.15,
    Hard: 1.3
  }
}
