import Recipe from './entities/Recipe';
import RecipeAttribution from './entities/RecipeAttribution';
import UserProfile from './entities/UserProfile';

import { ConnectionOptions } from 'typeorm'

export const production: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: 'all',
  dropSchema: false,
  entities: [Recipe, RecipeAttribution, UserProfile]
}

export const test: ConnectionOptions = {
  name: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'test-no-meat-may',
  password: '',
  database: 'test-no-meat-may',
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [Recipe, RecipeAttribution, UserProfile]
}

export const development: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: 'all',
  dropSchema: false,
  entities: [Recipe, RecipeAttribution, UserProfile]
}