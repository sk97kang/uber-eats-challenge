import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class SubscribeInput extends PickType(Podcast, ['id'], InputType) {}

@ObjectType()
export class SubscribeOutput extends CoreOutput {}
