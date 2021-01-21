import { Field, ObjectType, InputType, Int, PickType } from "@nestjs/graphql";
import { CoreOutput } from "./output.dto";
import { Podcast } from "../entities/podcast.entity";
import { IsInt } from "class-validator";
import { Episode } from "../entities/episode.entity";
import { Review } from "../entities/review.entity";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class GetAllPodcastsOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@InputType()
export class PodcastSearchInput extends PickType(Podcast, ["id"], InputType) {}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field(type => Podcast, { nullable: true })
  podcast?: Podcast;
}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  episodes?: Episode[];
}

@InputType()
export class EpisodesSearchInput {
  @Field(type => Int)
  @IsInt()
  podcastId: number;

  @Field(type => Int)
  @IsInt()
  episodeId: number;
}

export class GetEpisodeOutput extends CoreOutput {
  episode?: Episode;
}

@InputType()
export class SearchPodcastsInput extends PickType(
  Podcast,
  ["title"],
  InputType
) {}

@ObjectType()
export class SearchPodcastsOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@InputType()
export class ReviewPodcastInput extends PickType(
  Review,
  ["title", "content"],
  InputType
) {
  @Field(type => Number)
  podcastId: number;
}

@InputType()
export class SubscribeToPodcastInput extends PickType(
  Podcast,
  ["id"],
  InputType
) {}

@InputType()
export class SeeSubscriptionsInput extends PickType(
  Podcast,
  ["id"],
  InputType
) {}

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
  @Field(type => [Podcast], { nullable: true })
  subscriptions?: Podcast[];
}

@InputType()
export class MakeEpisodeAsPlayedInput {
  @Field(type => Number)
  podcastId: number;

  @Field(type => Number)
  episodeId: number;
}
