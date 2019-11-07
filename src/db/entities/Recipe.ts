import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";

import { RecipePhoto } from './RecipePhoto';
import { RecipeAttribution } from './RecipeAttribution';

export enum DifficultyEnum {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum CostEnum {
  Budget = 'Budget',
  Moderate = 'Moderate',
  Expensive = 'Expensive'
}

export enum MealTypeEnum {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack'
}

@Entity()
export default class Recipe {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text'
  })
  ingredients: string;

  @Column({
    type: 'text',
  })
  method: string;

  @Column()
  hashtags: string;

  @Column({
    type: 'enum',
    enum: DifficultyEnum
  })
  difficulty: DifficultyEnum

  @Column({
    type: 'enum',
    enum: CostEnum
  })
  cost: CostEnum

  @Column({
    type: 'enum',
    enum: MealTypeEnum
  })
  mealType: MealTypeEnum

  @OneToMany(() => RecipePhoto, photo => photo.recipe, {
    eager: true,
    onDelete: 'CASCADE'
  })
  photos: RecipePhoto[]

  @OneToOne(() => RecipeAttribution, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  attribution: RecipeAttribution

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
