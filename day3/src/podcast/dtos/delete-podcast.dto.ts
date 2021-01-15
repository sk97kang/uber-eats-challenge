import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeletePodcastInput {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class DeletePodcastOutput {
  @Field((type) => String, { nullable: true })
  err?: string;
}
