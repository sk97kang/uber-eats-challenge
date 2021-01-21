import { Injectable } from "@nestjs/common";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from "./dtos/create-episode.dto";
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from "./dtos/create-podcast.dto";
import { UpdateEpisodeInput } from "./dtos/update-episode.dto";
import { UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
  GetEpisodeOutput,
  SearchPodcastsInput,
  SearchPodcastsOutput,
  ReviewPodcastInput,
  SubscribeToPodcastInput,
  SeeSubscriptionsInput,
  SeeSubscriptionsOutput,
  MakeEpisodeAsPlayedInput,
} from "./dtos/podcast.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Review } from "./entities/review.entity";

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: "Internal server error occurred.",
  };

  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastInput): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcastRepository.create({ title, category });
      const { id } = await this.podcastRepository.save(newPodcast);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        { id },
        { relations: ["episodes", "reviews"] }
      );
      if (!podcast) {
        return {
          ok: false,
          error: `Podcast with id ${id} not found`,
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.podcastRepository.delete({ id });
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast({
    id,
    payload,
  }: UpdatePodcastInput): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }

      if (
        payload.rating !== null &&
        (payload.rating < 1 || payload.rating > 5)
      ) {
        return {
          ok: false,
          error: "Rating must be between 1 and 5.",
        };
      } else {
        const updatedPodcast: Podcast = { ...podcast, ...payload };
        await this.podcastRepository.save(updatedPodcast);
        return { ok };
      }
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return {
      ok: true,
      episodes: podcast.episodes,
    };
  }

  async getEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<GetEpisodeOutput> {
    const { episodes, ok, error } = await this.getEpisodes(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = episodes.find(episode => episode.id === episodeId);
    if (!episode) {
      return {
        ok: false,
        error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`,
      };
    }
    return {
      ok: true,
      episode,
    };
  }

  async createEpisode({
    podcastId,
    title,
    category,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const newEpisode = this.episodeRepository.create({ title, category });
      newEpisode.podcast = podcast;
      const { id } = await this.episodeRepository.save(newEpisode);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { episode, error, ok } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      await this.episodeRepository.delete({ id: episode.id });
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeInput): Promise<CoreOutput> {
    try {
      const { episode, ok, error } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      const updatedEpisode = { ...episode, ...rest };
      await this.episodeRepository.save(updatedEpisode);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async searchPodcasts({
    title,
  }: SearchPodcastsInput): Promise<SearchPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find({
        where: { title: ILike(`%${title}%`) },
      });
      if (!podcasts) {
        return {
          ok: false,
          error: "Podcast not found",
        };
      }
      return {
        ok: true,
        podcasts,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async reviewPodcast(
    writer: User,
    { podcastId, title, content }: ReviewPodcastInput
  ): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      await this.reviewRepository.save(
        this.reviewRepository.create({
          title,
          content,
          writer,
          podcast,
        })
      );
      return {
        ok: true,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async subscribeToPodcast(
    subscriber: User,
    { id }: SubscribeToPodcastInput
  ): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      const findUser = await this.usersRepository.findOne(
        { id: subscriber.id },
        { relations: ["subscriptions"] }
      );
      const findSubscriptions = findUser.subscriptions.find(
        subscription => subscription.id === id
      );
      if (findSubscriptions) {
        return {
          ok: false,
          error: "already subscribe to podcast",
        };
      }
      findUser.subscriptions = [...findUser.subscriptions, podcast];
      await this.usersRepository.save(findUser);
      return {
        ok: true,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async seeSubscriptions(user: User): Promise<SeeSubscriptionsOutput> {
    try {
      const findUser = await this.usersRepository.findOne(
        { id: user.id },
        { relations: ["subscriptions"] }
      );
      return {
        ok: true,
        subscriptions: findUser.subscriptions,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async makeEpisodeAsPlayed(
    user: User,
    { podcastId, episodeId }: MakeEpisodeAsPlayedInput
  ): Promise<CoreOutput> {
    try {
      const { episode, ok, error } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      const findUser = await this.usersRepository.findOne(
        { id: user.id },
        { relations: ["playedEpisodes"] }
      );
      const findEpisode = findUser.playedEpisodes.find(
        playedEpisode => playedEpisode.id === episodeId
      );
      if (findEpisode) {
        return {
          ok: false,
          error: "already played episode",
        };
      }
      findUser.playedEpisodes = [...findUser.playedEpisodes, episode];
      await this.usersRepository.save(findUser);
      return {
        ok: true,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }
}
