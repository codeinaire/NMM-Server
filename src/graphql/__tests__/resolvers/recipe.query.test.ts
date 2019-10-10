import recipeResolver from '../../resolvers/recipe';

export const mockRecipe = {
  standardResolution: {
    width: 640,
    height: 640,
    url: 'Test URL'
  },
  title: 'Test Title',
  attribution: {
    name:'Test Name',
    url: 'Test URL'
  },
  ingredients: 'Test Ingredients',
  method: 'Test Method',
  hashtags: ['testString'],
}

describe('[Recipe.Query.recipes]', () => {
  const mockContext = {
    dataSources: {
      recipeAPI: { findAllRecipes: jest.fn() },
    },
  };
  // just for easy access
  const { findAllRecipes } = mockContext.dataSources.recipeAPI;

  it('calls ALL recipes from database', async () => {
    // NOTE: these results get reversed in the resolver
    findAllRecipes.mockReturnValueOnce([ mockRecipe ]);

    // check the resolver response
    const res = await recipeResolver.Query.recipes(null, {}, mockContext);
    expect(res).toEqual([ mockRecipe ]);
  });
});
