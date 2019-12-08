import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export default class UserProfile{
  @PrimaryColumn()
  id: string

  @Column()
  totalPoints: number

  @Column()
  challengeGoals: number

  @Column()
  motivations: string

  @Column()
  username: string

  @Column()
  bio: string

  @Column()
  lowResProfile: string

  @Column()
  standardResolution: string

  @Column()
  challengeQuote: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
