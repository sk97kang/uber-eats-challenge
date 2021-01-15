import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@InputType()
export class EpisodesInput {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class EpisodesOutput {
  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];

  @Field((type) => String, { nullable: true })
  err?: string;
}
