import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PodcastsService } from "./podcasts.service";
import { Podcast } from "./entities/podcast.entity";
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from "./dtos/create-podcast.dto";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
  SearchPodcastsOutput,
  SearchPodcastsInput,
  ReviewPodcastInput,
  SubscribeToPodcastInput,
  SeeSubscriptionsOutput,
  SeeSubscriptionsInput,
  MakeEpisodeAsPlayedInput,
} from "./dtos/podcast.dto";
import { UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from "./dtos/create-episode.dto";
import { UpdateEpisodeInput } from "./dtos/update-episode.dto";
import { Role } from "src/auth/role.decorator";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User } from "src/users/entities/user.entity";

@Resolver(of => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query(returns => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation(returns => CreatePodcastOutput)
  @Role(["Host"])
  createPodcast(
    @Args("input") createPodcastInput: CreatePodcastInput
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(createPodcastInput);
  }

  @Query(returns => PodcastOutput)
  getPodcast(
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Host"])
  deletePodcast(
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(podcastSearchInput.id);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Host"])
  updatePodcast(
    @Args("input") updatePodcastInput: UpdatePodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePodcastInput);
  }
}

@Resolver(of => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query(returns => EpisodesOutput)
  getEpisodes(
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Mutation(returns => CreateEpisodeOutput)
  @Role(["Host"])
  createEpisode(
    @Args("input") createEpisodeInput: CreateEpisodeInput
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Host"])
  updateEpisode(
    @Args("input") updateEpisodeInput: UpdateEpisodeInput
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Host"])
  deleteEpisode(
    @Args("input") episodesSearchInput: EpisodesSearchInput
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(episodesSearchInput);
  }

  @Query(returns => SearchPodcastsOutput)
  @Role(["Listener"])
  searchPodcasts(
    @Args("input") searchPodcastsInput: SearchPodcastsInput
  ): Promise<SearchPodcastsOutput> {
    return this.podcastService.searchPodcasts(searchPodcastsInput);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Listener"])
  reviewPodcast(
    @AuthUser() writer: User,
    @Args("input") reviewPodcastInput: ReviewPodcastInput
  ): Promise<CoreOutput> {
    return this.podcastService.reviewPodcast(writer, reviewPodcastInput);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Listener"])
  subscribeToPodcast(
    @AuthUser() subscriber: User,
    @Args("input") subscribeToPodcastInput: SubscribeToPodcastInput
  ): Promise<CoreOutput> {
    return this.podcastService.subscribeToPodcast(
      subscriber,
      subscribeToPodcastInput
    );
  }

  @Query(returns => SeeSubscriptionsOutput)
  @Role(["Listener"])
  seeSubscriptions(@AuthUser() user: User) {
    return this.podcastService.seeSubscriptions(user);
  }

  @Mutation(returns => CoreOutput)
  @Role(["Listener"])
  makeEpisodeAsPlayed(
    @AuthUser() user: User,
    @Args("input") makeEpisodeAsPlayedInput: MakeEpisodeAsPlayedInput
  ): Promise<CoreOutput> {
    return this.podcastService.makeEpisodeAsPlayed(
      user,
      makeEpisodeAsPlayedInput
    );
  }
}
