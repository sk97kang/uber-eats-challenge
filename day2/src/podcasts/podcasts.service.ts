import { Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAll(): Podcast[] {
    return this.podcasts;
  }

  createPodcast(createPodcastInput): Podcast {
    const newPodcast: Podcast = {
      id: this.podcasts.length + 1,
      ...createPodcastInput,
    };
    this.podcasts.push(newPodcast);
    return newPodcast;
  }

  getOne(id: number): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === id);
    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${id} not found.`);
    }
    return podcast;
  }

  editPodcast(id: number, editPodcastInput): Podcast {
    const podcast = this.getOne(id);
    const newPodcast = {
      ...podcast,
      ...editPodcastInput,
    };
    this.deletePodcast(id);
    this.podcasts.push(newPodcast);
    return newPodcast;
  }

  deletePodcast(id: number): boolean {
    this.getOne(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== id);
    return true;
  }

  getEpisodes(id: number): Episode[] {
    return this.getOne(id).episodes;
  }

  getEpisode(id: number, episodeId: number): Episode {
    const episode = this.getEpisodes(id).find(
      (episode) => episode.id === episodeId,
    );
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${episodeId} not found.`);
    }
    return episode;
  }

  createEpisode(id: number, createEpisodeInput): Episode {
    const podcast = this.getOne(id);
    const newEpisode = {
      id: podcast.episodes.length + 1,
      ...createEpisodeInput,
    };
    podcast.episodes.push(newEpisode);
    return newEpisode;
  }

  editEpisode(id: number, episodeId: number, updateEpisodeInput): Episode {
    const episode = this.getEpisode(id, episodeId);
    const newEpisode = {
      ...episode,
      ...updateEpisodeInput,
    };
    this.deleteEpisode(id, episodeId);
    this.getOne(id).episodes.push(newEpisode);
    return newEpisode;
  }

  deleteEpisode(id: number, episodeId: number): boolean {
    const podcast = this.getOne(id);
    this.getEpisode(id, episodeId);
    podcast.episodes = podcast.episodes.filter(
      (episode) => episode.id !== episodeId,
    );
    return true;
  }
}
