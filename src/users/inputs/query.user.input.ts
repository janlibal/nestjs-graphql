import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { RoleInput } from 'src/roles/role.input';
import { User } from '../model/user.model';


export class FilterUserInput {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoleInput)
  roles?: RoleInput[] | null;
}

export class SortUserInput {
  @Type(() => String)
  @IsString()
  orderBy: keyof User;

  @IsString()
  order: string;
}

export class QueryUserInput {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterUserInput, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserInput)
  filters?: FilterUserInput | null;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserInput, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserInput)
  sort?: SortUserInput[] | null;
}