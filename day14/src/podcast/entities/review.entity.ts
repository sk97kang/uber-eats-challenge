import { ObjectType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Podcast } from "./podcast.entity";

@Entity()
@ObjectType()
export class Review extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  content: string;

  @ManyToOne(type => Podcast, podcast => podcast.reviews, {
    onDelete: "CASCADE",
  })
  @Field(type => Podcast)
  podcast: Podcast;

  @ManyToOne(type => User, { onDelete: "CASCADE" })
  @Field(type => User)
  writer: User;
}
