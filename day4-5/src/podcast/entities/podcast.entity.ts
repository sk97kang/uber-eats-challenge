import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  category: string;

  @Column()
  @Field(type => Number)
  @IsNumber()
  rating: number;
}
