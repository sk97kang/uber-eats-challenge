import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expose, serialize } from 'class-transformer';
import { execute } from 'graphql';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

const InternalServerErrorOutput = {
  ok: false,
  error: 'Internal server error occurred.',
};

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PodcastService', () => {
  let service: PodcastsService;
  let podcastsRepository: MockRepository<Podcast>;
  let episodesRepository: MockRepository<Episode>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastsRepository = module.get(getRepositoryToken(Podcast));
    episodesRepository = module.get(getRepositoryToken(Episode));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(podcastsRepository).toBeDefined();
    expect(episodesRepository).toBeDefined();
  });

  describe('getAllPodcasts', () => {
    it('should find podcasts', async () => {
      podcastsRepository.find.mockResolvedValue([{ id: 1 }]);

      const result = await service.getAllPodcasts();

      expect(result).toEqual({ ok: true, podcasts: expect.any(Array) });
    });

    it('should fail on exception', async () => {
      podcastsRepository.find.mockRejectedValue(new Error());

      const result = await service.getAllPodcasts();

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('createPodcast', () => {
    it('should create a podcast', async () => {
      podcastsRepository.create.mockReturnValue({ id: 1 });
      podcastsRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.createPodcast({
        title: 'test',
        category: 'test',
      });

      expect(podcastsRepository.create).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(podcastsRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true, id: expect.any(Number) });
    });

    it('should fail on exception', async () => {
      podcastsRepository.save.mockRejectedValue(new Error());

      const result = await service.createPodcast({
        title: 'test',
        category: 'test',
      });

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('getPodcast', () => {
    it('should find podcast with id', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.getPodcast(1);

      expect(result).toEqual({ ok: true, podcast: expect.any(Object) });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getPodcast(1);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());

      const result = await service.getPodcast(1);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('deletePodcast', () => {
    it('should delete podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.deletePodcast(1);

      expect(result).toEqual({ ok: true });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.deletePodcast(1);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exepction', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });
      podcastsRepository.delete.mockRejectedValue(new Error());

      const result = await service.deletePodcast(1);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('updatePodcast', () => {
    const updatePodcastArgs = {
      id: 1,
      payload: { title: 'test' },
    };
    it('should update podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.updatePodcast(updatePodcastArgs);

      expect(podcastsRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.updatePodcast(updatePodcastArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail if rating not be between 1 and 5', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.updatePodcast({
        id: 1,
        payload: { rating: 0 },
      });

      expect(result).toEqual({
        ok: false,
        error: 'Rating must be between 1 and 5.',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });
      podcastsRepository.save.mockRejectedValue(new Error());

      const result = await service.updatePodcast(updatePodcastArgs);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('getEpisodes', () => {
    it('should find episodes', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });

      const result = await service.getEpisodes(1);

      expect(result).toEqual({ ok: true, episodes: expect.any(Array) });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getEpisodes(1);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());

      const result = await service.getEpisodes(1);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('getEpisode', () => {
    const episodeArgs = { podcastId: 1, episodeId: 1 };
    it('should find episode', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });

      const result = await service.getEpisode(episodeArgs);

      expect(result).toEqual({ ok: true, episode: { id: 1 } });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getEpisode(episodeArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail if no exists episode', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1, episodes: [] });

      const result = await service.getEpisode(episodeArgs);

      expect(result).toEqual({
        ok: false,
        error: `Episode with id ${episodeArgs.episodeId} not found in podcast with id ${episodeArgs.podcastId}`,
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.getEpisode(episodeArgs);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('createEpisode', () => {
    const createEpisodeArgs = {
      podcastId: 1,
      title: 'test',
      category: 'test',
    };
    it('should create a episode', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });
      episodesRepository.create.mockReturnValue({ id: 1 });
      episodesRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.createEpisode(createEpisodeArgs);

      expect(episodesRepository.create).toHaveBeenCalledTimes(1);
      expect(episodesRepository.create).toHaveBeenCalledWith(
        expect.any(Object),
      );

      expect(episodesRepository.save).toHaveBeenCalledTimes(1);
      expect(episodesRepository.save).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({ ok: true, id: 1 });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.createEpisode(createEpisodeArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockResolvedValue({ id: 1 });
      episodesRepository.save.mockRejectedValue(new Error());

      const result = await service.createEpisode(createEpisodeArgs);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('deleteEpisode', () => {
    const deleteEpisodeArgs = { podcastId: 1, episodeId: 1 };

    it('should delete episode', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });

      const result = await service.deleteEpisode(deleteEpisodeArgs);

      expect(episodesRepository.delete).toHaveBeenCalledTimes(1);
      expect(episodesRepository.delete).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.deleteEpisode(deleteEpisodeArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });
      episodesRepository.delete.mockRejectedValue(new Error());

      const result = await service.deleteEpisode(deleteEpisodeArgs);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });

  describe('updateEpisode', () => {
    const updateEpisodeArgs = {
      podcastId: 1,
      episodeId: 1,
      title: 'test',
    };
    it('should update episode', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });

      const result = await service.updateEpisode(updateEpisodeArgs);

      expect(episodesRepository.save).toHaveBeenCalledTimes(1);
      expect(episodesRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true });
    });

    it('should fail if no exists podcast', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.updateEpisode(updateEpisodeArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Podcast with id 1 not found',
      });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockResolvedValue({
        id: 1,
        episodes: [{ id: 1 }],
      });
      episodesRepository.save.mockRejectedValue(new Error());

      const result = await service.updateEpisode(updateEpisodeArgs);

      expect(result).toEqual(InternalServerErrorOutput);
    });
  });
});
