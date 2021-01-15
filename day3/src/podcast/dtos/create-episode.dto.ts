import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CreatePodcastInput } from './create-podcast.dto';

@InputType()
export class CreateEpisodeInput extends CreatePodcastInput {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput {
  @Field((type) => Number, { nullable: true })
  episodeId?: number;

  @Field((type) => String, { nullable: true })
  err?: string;
}
