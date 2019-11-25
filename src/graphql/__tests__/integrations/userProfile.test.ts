import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import { constructTestServer } from '../__utils';
import { mockRecipe } from '../resolvers/recipe.query.test';

// the mocked SQL DataSource store
const mockStore = {
  recipes: {
    findAll: jest.fn(),
  }
};

const GET_RECIPES = gql`
  query GET_RECIPES {
    recipes {
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
  it('finds all recipes', async () => {
    const { server, recipeAPI } = constructTestServer();

    recipeAPI.store = mockStore;
    recipeAPI.store.recipes.findAll.mockResolvedValue([mockRecipe]);

    const { query } = createTestClient(server);
    const res = await query({
      query: GET_RECIPES,
    });

    expect(res.data!.recipes).toEqual([mockRecipe]);
  });
});

describe('Mutations', () => {
});
