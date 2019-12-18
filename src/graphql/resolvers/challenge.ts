import { Challenge } from '../types';
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
  ChallengeDifficultyEnum: {
    Easy: 1,
    Medium: 1.15,
    Hard: 1.3
  }
}
