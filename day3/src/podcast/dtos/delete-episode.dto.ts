import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteEpisodeInput {
  @Field((type) => Number)
  podcastId: number;

  @Field((type) => Number)
  episodeId: number;
}

@ObjectType()
export class DeleteEpisodeOutput {
  @Field((type) => String, { nullable: true })
  err?: string;
}
