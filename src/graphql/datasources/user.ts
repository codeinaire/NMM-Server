import { DataSource } from 'apollo-datasource';

export default class UserAPI extends DataSource {
  store: any
  context: any
  public constructor({ store } : { store: any }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public initialize(config: any) {
    this.context = config.context;
  }

  // TODO - default points is just an estimate, not sure how points are going to work. Change later.
  public async findOrCreateUserProfile(id: string) {
    console.log('ID in datasource', id);

    const result = await this.store.users.findOrCreate({
      where: {
        id
      },
      defaults: {
        id, points: 100
      }
    });
    console.log('USER RESULT', result[0].dataValues);
    return result[0].dataValues;
  };
}