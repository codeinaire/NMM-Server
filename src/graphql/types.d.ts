export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Article = {
   __typename?: 'Article',
  id: Scalars['ID'],
  title: Scalars['String'],
  content: Scalars['String'],
  hashtag: Array<Scalars['String']>,
  type: Scalars['String'],
};

export type Attribution = {
   __typename?: 'Attribution',
  name: Scalars['String'],
  url: Scalars['String'],
  email: Scalars['String'],
  socialMedia?: Maybe<AttributionSocialMedia>,
};

export type AttributionInput = {
  name: Scalars['String'],
  email: Scalars['String'],
  website: Scalars['String'],
  socialMedia: AttributionSocialMediaInput,
};

export type AttributionSocialMedia = {
   __typename?: 'AttributionSocialMedia',
  facebook?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
};

export type AttributionSocialMediaInput = {
  facebook?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
};

export enum CostEnum {
  Budget = 'Budget',
  Moderate = 'Moderate',
  Expensive = 'Expensive'
}

export type CreateArticle = {
  title: Scalars['String'],
  content: Scalars['String'],
  hashtag: Array<Scalars['String']>,
  type: Scalars['String'],
};

export enum DifficultyEnum {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export type LowResolution = {
   __typename?: 'LowResolution',
  width: Scalars['Int'],
  height: Scalars['Int'],
  url: Scalars['String'],
};

export enum MealTypeEnum {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack'
}

export type Mutation = {
   __typename?: 'Mutation',
  createArticles?: Maybe<Array<Maybe<Article>>>,
  createArticle?: Maybe<Article>,
  createProfile?: Maybe<User>,
  createRecipe?: Maybe<Recipe>,
};


export type MutationCreateArticlesArgs = {
  articles: Array<Maybe<CreateArticle>>
};


export type MutationCreateArticleArgs = {
  article: CreateArticle
};


export type MutationCreateRecipeArgs = {
  recipe?: Maybe<RecipeInput>
};

export type Query = {
   __typename?: 'Query',
  recipes: Array<Maybe<Recipe>>,
  articles?: Maybe<Array<Maybe<Article>>>,
  me?: Maybe<User>,
};

export type Recipe = {
   __typename?: 'Recipe',
  /** **LIST && SHOW** */
  id: Scalars['ID'],
  title: Scalars['String'],
  difficulty: DifficultyEnum,
  cost: CostEnum,
  mealType: MealTypeEnum,
  hashtags: Scalars['String'],
  /** **LIST** */
  thumbnail: Thumbnail,
  lowResolution: LowResolution,
  /** **SHOW** */
  attribution: Attribution,
  ingredients: Scalars['String'],
  method: Scalars['String'],
  standardResolution: Array<Maybe<StandardResolution>>,
};

export type RecipeInput = {
  title: Scalars['String'],
  attribution: AttributionInput,
  ingredients: Scalars['String'],
  method: Scalars['String'],
  hashtags: Scalars['String'],
  difficulty: DifficultyEnum,
  cost: CostEnum,
  mealType: MealTypeEnum,
  recipePhotos: Array<Maybe<RecipePhotoInput>>,
};

export type RecipePhotoInput = {
  url: Scalars['String'],
  width: Scalars['Int'],
  height: Scalars['Int'],
  type: RecipePhotoInputEnum,
};

export enum RecipePhotoInputEnum {
  StandardResolution = 'StandardResolution',
  Thumbnail = 'Thumbnail',
  LowResolution = 'LowResolution'
}

export type StandardResolution = {
   __typename?: 'StandardResolution',
  width: Scalars['Int'],
  height: Scalars['Int'],
  url: Scalars['String'],
};

export type Thumbnail = {
   __typename?: 'Thumbnail',
  width: Scalars['Int'],
  height: Scalars['Int'],
  url: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  points: Scalars['Int'],
  recipeRead?: Maybe<Array<Maybe<Scalars['Int']>>>,
};
