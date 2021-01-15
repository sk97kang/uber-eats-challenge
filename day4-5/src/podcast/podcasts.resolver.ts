import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';

@Resolver(of => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @ResolveField(type => [Episode])
  async episodes(@Parent() podcast: Podcast): Promise<Episode[]> {
    const { episodes } = await this.podcastsService.getEpisodes(podcast.id);
    return episodes;
  }

  @Query(returns => [Podcast])
  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation(returns => CoreOutput)
  createPodcast(
    @Args('input') createPodcastDto: CreatePodcastDto,
  ): Promise<CoreOutput> {
    return this.podcastsService.createPodcast(createPodcastDto);
  }

  @Query(returns => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @Mutation(returns => CoreOutput)
  deletePodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(podcastSearchInput.id);
  }

  @Mutation(returns => CoreOutput)
  updatePodcast(
    @Args('input') updatePodcastDto: UpdatePodcastDto,
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePodcastDto);
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

  @Mutation(returns => CoreOutput)
  createEpisode(
    @Args('input') createEpisodeDto: CreateEpisodeDto,
  ): Promise<CoreOutput> {
    return this.podcastService.createEpisode(createEpisodeDto);
  }

  @Mutation(returns => CoreOutput)
  updateEpisode(
    @Args('input') updateEpisodeDto: UpdateEpisodeDto,
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(updateEpisodeDto);
  }

  @Mutation(returns => CoreOutput)
  deleteEpisode(
    @Args('input') episodesSearchInput: EpisodesSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(episodesSearchInput);
  }
}
