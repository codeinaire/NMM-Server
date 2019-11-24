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

  @Column({
    nullable: true,
    default: 'This user likes to keep an aire of mystery about them'
  })
  bio: string | null | undefined

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/codeinaire/image/upload/v1574140567/nmm-recipes/up8fe19f1ikxauczdhhs.jpg'
  })
  profilePic: string | null | undefined

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
