import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@InputType()
export class UpdatePodcastInput {
  @Field((type) => Number)
  id: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  category?: string;

  @Field((type) => Number, { nullable: true })
  rating?: number;

  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];
}

@ObjectType()
export class UpdatePodcastOutput {
  @Field((type) => String, { nullable: true })
  err?: string;
}
