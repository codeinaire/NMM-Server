import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
