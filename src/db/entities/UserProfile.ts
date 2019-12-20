import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export default class UserProfile {
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

  @Column({
    default: 'Fill in your bio for more points!'
  })
  bio: string

  @Column({
    default:
      'https://res.cloudinary.com/codeinaire/image/upload/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  })
  lowResProfile: string

  @Column({
    default:
      'https://res.cloudinary.com/codeinaire/image/upload/c_scale,q_auto,w_640/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  })
  standardResolution: string

  @Column({
    default: 'What is a quote that inspires you to grow?'
  })
  challengeQuote: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
