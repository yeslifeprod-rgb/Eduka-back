import { IsString, IsArray, IsOptional, ValidateNested, IsEmail, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class ParentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}

class ChildDto {
  @IsString()
  firstName: string;

  @IsString()
  name: string;

  @IsDateString()
  birthday: string;

  @IsString()
  class: string;
}

export class UpdateModifProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ParentDto)
  parents?: ParentDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children?: ChildDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplines?: string[];
}
