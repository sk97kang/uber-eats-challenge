import { Field, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class PodcastsOutput {
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];

  @Field((type) => String, { nullable: true })
  err?: string;
}
