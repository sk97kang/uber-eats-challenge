import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  @IsString()
  @IsOptional()
  token?: string;
}
