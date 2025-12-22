import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create.question.dto';
import { UpdateQuestionDto } from './dto/update.question.dto';
import { GetCurrentUser } from 'src/auth/common/decorators';

@Controller()
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post('surveys/:surveyId/questions')
  create(
    @GetCurrentUser('sub') userId: number,
    @Param('surveyId') surveyId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionsService.create(userId, +surveyId, dto);
  }

  @Get('surveys/:surveyId/questions')
  findAll(
    @GetCurrentUser('sub') userId: number,
    @Param('surveyId') surveyId: string,
  ) {
    return this.questionsService.findAll(userId, +surveyId);
  }

  @Patch('questions/:id')
  update(
    @GetCurrentUser('sub') userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(userId, +id, dto);
  }

  @Delete('questions/:id')
  remove(@GetCurrentUser('sub') userId: number, @Param('id') id: string) {
    return this.questionsService.remove(userId, +id);
  }
}
