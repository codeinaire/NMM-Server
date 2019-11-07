import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class AttributionSocialMedia {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    default: 'No Facebook details available.'
  })
  facebook: string

  @Column({
    nullable: true,
    default: 'No Instagram details available.'
  })
  instragram: string

  @Column({
    nullable: true,
    default: 'No Twitter details available'
  })
  twitter: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
