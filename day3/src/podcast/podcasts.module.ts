import { Module } from '@nestjs/common';
import { EpisodeResolver, PodcastsResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  providers: [PodcastsResolver, EpisodeResolver, PodcastsService],
})
export class PodcastsModule {}
