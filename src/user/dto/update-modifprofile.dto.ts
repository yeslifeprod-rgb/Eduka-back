import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ParentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;
}

class ChildDto {
  @IsString()
  firstName: string;

  @IsString()
  name: string;

  @IsString()
  birthday: string;

  @IsString()
  class: string;

  @IsOptional()
  @IsString()
  schoolId?: string;
}

export class UpdateModifProfileDto {
  @ValidateNested()
  @Type(() => ParentDto)
  parents: ParentDto;

  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children: ChildDto[];

  @IsArray()
  @IsString({ each: true })
  disciplines: string[];
}
