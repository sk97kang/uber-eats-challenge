import { Injectable } from '@nestjs/common';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import { PodcastInput, PodcastOutput } from './dtos/podcast.dto';
import { PodcastsOutput } from './dtos/podcasts.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dtos/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAllPodcasts(): PodcastsOutput {
    return { podcasts: this.podcasts };
  }

  createPodcast({ title, category }: CreatePodcastInput): CreatePodcastOutput {
    const id = Date.now();
    this.podcasts.push({ id, title, category, rating: 0, episodes: [] });
    return { id, err: null };
  }

  getPodcast({ id }: PodcastInput): PodcastOutput {
    const foundPodcasts = this.podcasts.filter((podcast) => podcast.id === id);
    if (foundPodcasts.length === 0) {
      return { podcast: null, err: 'Podcast not found.' };
    }
    if (foundPodcasts.length === 1) {
      return { podcast: foundPodcasts[0], err: null };
    }
    if (foundPodcasts.length > 2) {
      return { podcast: null, err: 'More than one items with same id.' };
    }
  }

  deletePodcast({ id }: DeletePodcastInput): DeletePodcastOutput {
    this.podcasts = this.podcasts.filter((p) => p.id !== +id);
    return { err: null };
  }

  updatePodcast(updatePodcastInput: UpdatePodcastInput): UpdatePodcastOutput {
    const { podcast, err: findErr } = this.getPodcast({
      id: updatePodcastInput.id,
    });
    if (findErr) {
      return { err: findErr };
    }
    const { err: deleteErr } = this.deletePodcast({
      id: updatePodcastInput.id,
    });
    if (deleteErr) {
      return { err: deleteErr };
    }
    this.podcasts.push({ ...podcast, ...updatePodcastInput });
    return { err: null };
  }

  getEpisodes({ podcastId }: EpisodesInput): EpisodesOutput {
    const { podcast, err } = this.getPodcast({ id: podcastId });
    if (err) {
      return { episodes: null, err };
    }
    return { episodes: podcast.episodes, err: null };
  }

  createEpisode({
    podcastId,
    title,
    category,
  }: CreateEpisodeInput): CreateEpisodeOutput {
    const { podcast, err: findErr } = this.getPodcast({ id: podcastId });
    if (findErr) {
      return { episodeId: null, err: findErr };
    }
    const episodeId = Date.now();
    const newEpisode: Episode = { id: episodeId, title, category, rating: 0 };
    const { err } = this.updatePodcast({
      ...podcast,
      episodes: [...podcast.episodes, newEpisode],
    });
    if (err) {
      return { episodeId: null, err };
    }
    return { episodeId, err: null };
  }

  deleteEpisode({
    podcastId,
    episodeId,
  }: DeleteEpisodeInput): DeleteEpisodeOutput {
    const { podcast, err: findErr } = this.getPodcast({ id: podcastId });
    if (findErr) {
      return { err: findErr };
    }
    const { err } = this.updatePodcast({
      id: podcastId,
      episodes: podcast.episodes.filter((episode) => episode.id !== episodeId),
    });
    if (err) {
      return { err };
    }
    return { err: null };
  }

  findEpisode(
    podcastId: number,
    episodeId: number,
  ): { episode: Episode | null; err: string | null } {
    const { episodes, err: findErr } = this.getEpisodes({ podcastId });
    if (findErr) {
      return { episode: null, err: findErr };
    }
    const episode = episodes.find((episode) => episode.id === +episodeId);
    if (!episode) {
      return { episode: null, err: 'Episode not found' };
    }
    return { episode, err: null };
  }

  updateEpisode(updateEpisodeInput: UpdateEpisodeInput): UpdateEpisodeOutput {
    const { episode, err: findEpisodeErr } = this.findEpisode(
      updateEpisodeInput.podcastId,
      updateEpisodeInput.episodeId,
    );
    if (findEpisodeErr) {
      return { err: findEpisodeErr };
    }
    const { err: deleteErr } = this.deleteEpisode({
      podcastId: updateEpisodeInput.podcastId,
      episodeId: updateEpisodeInput.episodeId,
    });
    if (deleteErr) {
      return { err: deleteErr };
    }
    const { podcast, err: fundPodcastErr } = this.getPodcast({
      id: updateEpisodeInput.podcastId,
    });
    if (fundPodcastErr) {
      return { err: fundPodcastErr };
    }
    this.updatePodcast({
      ...podcast,
      episodes: [...podcast.episodes, { ...episode, ...updateEpisodeInput }],
    });
    return { err: null };
  }
}
