import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreatePodcastInput {
  @Field((type) => String)
  title: string;

  @Field((type) => String)
  category: string;
}

@ObjectType()
export class CreatePodcastOutput {
  @Field((type) => Number, { nullable: true })
  id?: number;

  @Field((type) => String, { nullable: true })
  err?: string;
}
