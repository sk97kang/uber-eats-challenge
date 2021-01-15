import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateEpisodeInput {
  @Field((type) => Number)
  podcastId: number;

  @Field((type) => Number)
  episodeId: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  category?: string;

  @Field((type) => Number, { nullable: true })
  rating?: number;
}

@ObjectType()
export class UpdateEpisodeOutput {
  @Field((type) => String, { nullable: true })
  err?: string;
}
