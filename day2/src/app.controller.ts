import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get()
  hello() {
    return 'Welcom to my Podcast API. Made by Kan';
  }
}
