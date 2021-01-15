import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class PodcastInput {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class PodcastOutput {
  @Field((type) => Podcast, { nullable: true })
  podcast?: Podcast;

  @Field((type) => String, { nullable: true })
  err?: string;
}
