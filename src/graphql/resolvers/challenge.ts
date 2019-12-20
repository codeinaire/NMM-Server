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
    createChallenge: async (
      _: any,
      { challengeInput }: { challengeInput: ChallengeInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<Challenge> => {
      console.log('challengeInput', challengeInput)

      log.info('Finding challenge')
      // TODO - add auth
      const verifiedUser = '1'
      const createdChallenge = await dataSources.challengeAPI.createChallenge(
        challengeInput,
        challengeInput.type,
        verifiedUser
      )
      log.info('Found challenge')
      return createdChallenge
    }
  },
  ChallengeDifficultyEnum: {
    Easy: 1,
    Medium: 1.15,
    Hard: 1.3
  }
}
