import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  Max,
  ValidateIf,
  IsEmail,
} from 'class-validator';
import { QuestionType } from '../../questions/dto/create.question.dto';

export class CreateResponseDto {
  @ValidateIf((o) => o.questionType === QuestionType.TEXT)
  @IsString()
  textAnswer?: string;

  @ValidateIf(
    (o) =>
      o.questionType === QuestionType.SINGLE_CHOICE ||
      o.questionType === QuestionType.MULTIPLE_CHOICE,
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  selectedOptionIds?: number[];

  @ValidateIf((o) => o.questionType === QuestionType.RATING)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEmail()
  respondentEmail?: string;

  questionType: QuestionType;
}
