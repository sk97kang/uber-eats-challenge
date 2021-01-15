import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class SeeProfileInput extends PickType(User, ['id']) {}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
