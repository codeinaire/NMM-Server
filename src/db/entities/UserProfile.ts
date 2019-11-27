import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // BeforeInsert
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
  profilePic: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // @BeforeInsert()
  // addId() {
  //   // not sure what to implement, but I may need to implement something here to insert the auth0 id
  // }
}
