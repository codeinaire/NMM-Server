import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm"

import RecipeAttribution from './RecipeAttribution'


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
  id: number

  @Column()
  title: string

  @Column({
    type: 'text'
  })
  ingredients: string

  @Column({
    type: 'text',
  })
  method: string

  @Column()
  hashtags: string

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

  @Column()
  lowResolution: string

  @Column()
  standardResolution: string

  @OneToOne(() => RecipeAttribution, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove']
  })
  @JoinColumn()
  attribution: RecipeAttribution

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
