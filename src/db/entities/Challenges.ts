import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import Recipe from './Recipe'

export enum TypeEnum {
  Recipe = 'Recipe'
}

export enum SectionsCompletedEnum {
  Ingredients = 'Ingredients',
  Method = 'Method',
  ShareFriendsImage = 'ShareFriendsImage',
  ShareRecipe = 'ShareRecipe'
}

@Entity()
export default class Challenge {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: TypeEnum
  })
  type: TypeEnum

  @Column()
  maxAwardablePoints: number

  @Column()
  awardedPoints: number

  @Column()
  maxSectionsCompletable: number

  @Column({
    type: 'enum',
    array: true,
    default: '{}',
    enum: SectionsCompletedEnum
  })
  sectionsCompleted: SectionsCompletedEnum[]

  @Column({
    type: 'character varying',
    array: true,
    default: '{}'
  })
  sharedFriendsImages: string[]

  @Column('int', { nullable: true })
  recipeId: number

  @ManyToOne(() => Recipe, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
