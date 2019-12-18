import { injectable, inject } from 'inversify'
// DB Entities
import ChallengeEntity from '../../db/entities/Challenge'

// TYPES
// import { ChallengeInput } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IChallengeAPI, IDatabase, ICalculatePoints } from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class ChallengeAPI implements IChallengeAPI {
  private readonly calculatePoints: ICalculatePoints
  // private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints
  ) {
    this.calculatePoints = calculatePoints
  }

  public async initialize(config: DataSourceConfig<any>) {
    // this.context = config.context
    this.db = await this.database.getDatabase()
  }

  /**
   * findChallenge
   */
  public async findChallenge() {
    console.log('calculatePoints,', this.calculatePoints);

    const challenge = await this.db.getRepository(ChallengeEntity).findOne({
      id: 1
    })

    console.log('challenge', challenge);


    return challenge
  }

}