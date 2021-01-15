import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
export class Episode {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  title: string;

  @Column()
  @Field(type => String)
  category: string;

  @Column()
  @Field(type => Number)
  podcastId: number;
}
