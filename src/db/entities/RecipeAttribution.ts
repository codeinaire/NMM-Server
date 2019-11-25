import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from "typeorm"
import Recipe from './Recipe';
import AttributionSocialMedia from './AttributionSocialMedia';

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

  @OneToMany(() => Recipe, recipe => recipe.recipeAttribution)
  recipes: Recipe[]

  @OneToOne(() => AttributionSocialMedia, attributionSocialMedia => attributionSocialMedia.recipeAttribution, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  attributionSocialMedia: AttributionSocialMedia

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
