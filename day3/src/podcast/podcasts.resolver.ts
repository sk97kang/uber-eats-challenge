import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PodcastsOutput } from './dtos/podcasts.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';
import { PodcastInput, PodcastOutput } from './dtos/podcast.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/update-podcast.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { Episode } from './entities/episode.entity';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dtos/update-episode.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((type) => PodcastsOutput)
  getAllPodcasts(): PodcastsOutput {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((type) => CreatePodcastOutput)
  createPodcast(@Args('input') createPodcastDto: CreatePodcastInput) {
    return this.podcastsService.createPodcast(createPodcastDto);
  }

  @Query((type) => PodcastOutput)
  getPodcast(@Args('input') { id }: PodcastInput): PodcastOutput {
    return this.podcastsService.getPodcast({ id });
  }

  @Mutation((type) => UpdatePodcastOutput)
  updatePodcast(@Args('input') updatePodcastInput: UpdatePodcastInput) {
    return this.podcastsService.updatePodcast(updatePodcastInput);
  }

  @Mutation((type) => DeletePodcastOutput)
  deletePodcast(
    @Args('input') { id }: DeletePodcastInput,
  ): DeletePodcastOutput {
    return this.podcastsService.deletePodcast({ id });
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query((type) => EpisodesOutput)
  getEpisodes(@Args('input') episodesInput: EpisodesInput): EpisodesOutput {
    return this.podcastService.getEpisodes(episodesInput);
  }

  @Mutation((type) => CreateEpisodeOutput)
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): CreateEpisodeOutput {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation((type) => UpdateEpisodeOutput)
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): UpdateEpisodeOutput {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation((type) => DeleteEpisodeOutput)
  deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): DeleteEpisodeOutput {
    return this.podcastService.deleteEpisode(deleteEpisodeInput);
  }
}
