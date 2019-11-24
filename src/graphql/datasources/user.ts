import { injectable, inject } from "inversify"
// DB Entities
import UserEntity from '../../db/entities/UserProfile'

// TYPES
import { UserProfileInput, UserProfile} from '../types'
import { TYPES } from "../../inversifyTypes";
import { IUserAPI, IDatabase } from '../../types';
import { Connection } from "typeorm"
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class UserAPI implements IUserAPI {
  private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor() {
    // this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
    this.db = await this.database.getDatabase()
  }

  public async findAllRecipes() {
    console.log('this.context',this.context)

    const recipes = await this.db.getRepository(UserEntity).find({
      relations: ['attribution', 'attribution.attributionSocialMedia']
    })

    return recipes
  }

  public async createUserProfile({
    id,
    motivations,
    challengeGoals,
    username,
    bio,
    profilePic
  }: UserProfileInput): Promise<UserProfile> {
    let userProfile = new UserEntity()
    userProfile.id = id as string
    userProfile.motivations = motivations
    userProfile.challengeGoals = challengeGoals
    userProfile.username = username
    userProfile.bio = bio
    userProfile.profilePic = profilePic

    return userProfile
  }
}
