import {createTestClient} from 'apollo-server-testing';
import gql from 'graphql-tag';

import { constructTestServer } from '../__utils';
import { mockRecipe } from '../resolvers/recipe.query.test';

// the mocked SQL DataSource store
const mockStore = {
  recipes: {
    findAllRecipes: jest.fn(),
  }
};

const GET_RECIPES = gql`
  query GET_RECIPES {
    recipes {
      id
      title
      ingredients
      method
      hashtags
      attribution {
        name
        url
      }
      standardResolution {
        width
        height
        url
      }
    }
  }
`

describe('Queries', () => {
  // TODO - findAllRecipes isn't mocking, fix later
  it('finds all recipes', async () => {
    const { server, recipeAPI } = constructTestServer({
      context: () => ({
        event: {
          headers: 'test headers'
        }
      })
    });

    console.log('SERVER', server);



    recipeAPI.store = mockStore;
    recipeAPI.store.recipes.findAllRecipes.mockReturnValueOnce({get: () => ({mockRecipe})});

    console.log('recipeAPI.store', recipeAPI);
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_RECIPES,
    });
    console.log('RESPONSE', res);

    expect(res).toMatchSnapshot();
  });
});

describe('Mutations', () => {
});
