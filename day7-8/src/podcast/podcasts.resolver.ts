import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
} from './dtos/podcast.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SubscribeInput, SubscribeOutput } from './dtos/subscribe.dto';

@Resolver(of => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query(returns => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastsService.getAllPodcasts();
  }

  @Role(['Host'])
  @Mutation(returns => CreatePodcastOutput)
  createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(authUser, createPodcastInput);
  }

  @Query(returns => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @Role(['Host'])
  @Mutation(returns => CoreOutput)
  deletePodcast(
    @AuthUser() authUser: User,
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(authUser, podcastSearchInput.id);
  }

  @Role(['Host'])
  @Mutation(returns => CoreOutput)
  updatePodcast(
    @AuthUser() authUser: User,
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(authUser, updatePodcastInput);
  }

  @Role(['Any'])
  @Mutation(returns => SubscribeOutput)
  async subscribe(
    @AuthUser() authUser: User,
    @Args('input') subscribeInput: SubscribeInput,
  ): Promise<SubscribeOutput> {
    return this.podcastsService.subscribe(authUser, subscribeInput);
  }

  @Role(['Any'])
  @Mutation(returns => SubscribeOutput)
  async unsubscribe(
    @AuthUser() authUser: User,
    @Args('input') subscribeInput: SubscribeInput,
  ): Promise<SubscribeOutput> {
    return this.podcastsService.unsubscribe(authUser, subscribeInput);
  }
}

@Resolver(of => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query(returns => EpisodesOutput)
  getEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Role(['Host'])
  @Mutation(returns => CreateEpisodeOutput)
  createEpisode(
    @AuthUser() authUser: User,
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(authUser, createEpisodeInput);
  }

  @Role(['Host'])
  @Mutation(returns => CoreOutput)
  updateEpisode(
    @AuthUser() authUser: User,
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(authUser, updateEpisodeInput);
  }

  @Role(['Host'])
  @Mutation(returns => CoreOutput)
  deleteEpisode(
    @AuthUser() authUser: User,
    @Args('input') episodesSearchInput: EpisodesSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(authUser, episodesSearchInput);
  }
}
