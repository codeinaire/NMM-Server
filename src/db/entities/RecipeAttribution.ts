import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm"
import Recipe from './Recipe';

@Entity()
export default class RecipeAttribution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  website: string

  @Column()
  email: string

  @OneToOne(() => Recipe, recipe => recipe.recipeAttribution)
  recipe: Recipe

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
