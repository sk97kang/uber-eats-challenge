import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly service: PodcastsService) {}

  @Get()
  getAll(): Podcast[] {
    return this.service.getAll();
  }

  @Post()
  createPodcast(@Body() createPodcastInput): Podcast {
    return this.service.createPodcast(createPodcastInput);
  }

  @Get('/:id')
  getOne(@Param('id') podcastId: string): Podcast {
    return this.service.getOne(+podcastId);
  }

  @Patch('/:id')
  editPodcast(
    @Param('id') podcastId: string,
    @Body() editPodcastInput,
  ): Podcast {
    return this.service.editPodcast(+podcastId, editPodcastInput);
  }

  @Delete('/:id')
  deletePodcast(@Param('id') podcastId: string): boolean {
    return this.service.deletePodcast(+podcastId);
  }

  @Get('/:id/episodes')
  getEpisodes(@Param('id') podcastId: string): Episode[] {
    return this.service.getEpisodes(+podcastId);
  }

  @Post('/:id/episodes')
  createEpisode(@Param('id') podcastId, @Body() createEpisodeInput): Episode {
    return this.service.createEpisode(+podcastId, createEpisodeInput);
  }

  @Patch('/:id/episodes/:episodeId')
  editEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
    @Body() updateEpisodeInput,
  ): Episode {
    return this.service.editEpisode(+podcastId, +episodeId, updateEpisodeInput);
  }

  @Delete('/:id/episodes/:episodeId')
  deleteEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
  ): boolean {
    return this.service.deleteEpisode(+podcastId, +episodeId);
  }
}
