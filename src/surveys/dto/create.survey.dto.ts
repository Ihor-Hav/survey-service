import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsEmail,
} from 'class-validator';

export enum SurveyType {
  ANONYMOUS = 'ANONYMOUS',
  EMAIL = 'EMAIL',
}

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(SurveyType)
  type: SurveyType;

  @ValidateIf((o) => o.type === SurveyType.EMAIL)
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
