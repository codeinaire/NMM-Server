import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // OneToOne,
  // JoinColumn
} from 'typeorm'
// import RecipeAttribution from './RecipeAttribution';

@Entity()
export default class AttributionSocialMedia {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  facebook: string

  @Column()
  instragram: string

  @Column()
  twitter: string

  // @OneToOne(() => RecipeAttribution, recipeAttribution => recipeAttribution,  {
  //   eager: true,
  //   onDelete: 'CASCADE',
  //   cascade: ['insert', 'insert']
  // })
  // @JoinColumn()
  // recipeAttribution: RecipeAttribution

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
