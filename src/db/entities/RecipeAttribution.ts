import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import AttributionSocialMedia from './AttributionSocialMedia';

@Entity()
export default class RecipeAttribution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    nullable: true,
    default: 'No website details available.'
  })
  website: string

  @Column()
  email: string

  @OneToOne(() => AttributionSocialMedia, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove']
  })
  @JoinColumn()
  attributionSocialMedia: AttributionSocialMedia

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
