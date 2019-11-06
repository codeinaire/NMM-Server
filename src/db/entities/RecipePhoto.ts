import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import Recipe from './Recipe';

export enum RecipePhotoTypeEnum {
  StandardResolution = 'standardResolution',
  LowResolution = 'lowResolution',
  Thumbnail = 'thumbnail'
}

@Entity()
export class RecipePhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string

  @Column()
  width: number

  @Column()
  height: number

  @Column({
    type: 'enum',
    enum: RecipePhotoTypeEnum
  })
  type: RecipePhotoTypeEnum

  @ManyToOne(() => Recipe, recipe => recipe.photos)
  recipe: Recipe

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
