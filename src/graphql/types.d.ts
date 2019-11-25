export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number | string,
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

export type AttributionSocialMedia = {
   __typename?: 'AttributionSocialMedia',
  id: Scalars['ID'],
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
  createProfile?: Maybe<UserProfile>,
  createRecipe?: Maybe<Recipe>,
  deleteRecipe?: Maybe<Recipe>,
};


export type MutationCreateArticlesArgs = {
  articles: Array<Maybe<CreateArticle>>
};


export type MutationCreateArticleArgs = {
  article: CreateArticle
};


export type MutationCreateProfileArgs = {
  profile?: Maybe<UserProfileInput>
};


export type MutationCreateRecipeArgs = {
  recipe?: Maybe<RecipeInput>
};


export type MutationDeleteRecipeArgs = {
  title?: Maybe<Scalars['String']>
};

export type Query = {
   __typename?: 'Query',
  recipes: Array<Maybe<Recipe>>,
  articles?: Maybe<Array<Maybe<Article>>>,
  me?: Maybe<UserProfile>,
};


export type QueryMeArgs = {
  id: Scalars['String']
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
  lowResolution: Scalars['String'],
  /** **SHOW** */
  recipeAttribution: RecipeAttribution,
  ingredients: Scalars['String'],
  method: Scalars['String'],
  standardResolution: Scalars['String'],
};

export type RecipeAttribution = {
   __typename?: 'RecipeAttribution',
  id: Scalars['ID'],
  name: Scalars['String'],
  website?: Maybe<Scalars['String']>,
  email: Scalars['String'],
};

export type RecipeInput = {
  title: Scalars['String'],
  name: Scalars['String'],
  email: Scalars['String'],
  ingredients: Scalars['String'],
  method: Scalars['String'],
  hashtags: Scalars['String'],
  difficulty: DifficultyEnum,
  cost: CostEnum,
  mealType: MealTypeEnum,
  lowResolution: Scalars['String'],
  standardResolution: Scalars['String'],
  website?: Maybe<Scalars['String']>,
};

export type UserProfile = {
   __typename?: 'UserProfile',
  id: Scalars['ID'],
  totalPoints: Scalars['Int'],
  challengeGoals: Scalars['Int'],
  motivations: Scalars['String'],
  username: Scalars['String'],
  bio?: Maybe<Scalars['String']>,
  profilePic?: Maybe<Scalars['String']>,
};

export type UserProfileInput = {
  id: Scalars['ID'],
  challengeGoals: Scalars['Int'],
  motivations: Scalars['String'],
  username: Scalars['String'],
  bio?: Maybe<Scalars['String']>,
  profilePic?: Maybe<Scalars['String']>,
};
