import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastsRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodesRepository: Repository<Episode>,
  ) {}

  async getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastsRepository.find();
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    try {
      await this.podcastsRepository.save(
        this.podcastsRepository.create({
          title,
          category,
          rating: 0,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create Podcast',
      };
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastsRepository.findOne(id);
      if (!podcast) {
        return {
          ok: false,
          error: `${id} id podcast doesn't exist!`,
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.episodesRepository.delete({ podcastId: podcast.id });
      await this.podcastsRepository.delete(podcast);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.podcastsRepository.update(podcast, { ...rest });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    try {
      const { ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episodes = await this.episodesRepository.find({ podcastId });
      return { ok: true, episodes };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createEpisode({
    id,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    try {
      const { ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.episodesRepository.save(
        this.episodesRepository.create({
          podcastId: id,
          title,
          category,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episode = await this.episodesRepository.findOne({ podcastId });
      if (!episode) {
        return { ok: false, error: `${episodeId} id episode doesn't exist!` };
      }
      await this.episodesRepository.delete(episodeId);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    try {
      const { error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episode = await this.episodesRepository.findOne({ podcastId });
      if (!episode) {
        return { ok: false, error: `${episodeId} id episode doesn't exist!` };
      }
      await this.episodesRepository.update(episodeId, { ...rest });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
