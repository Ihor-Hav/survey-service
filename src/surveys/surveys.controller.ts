import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create.survey.dto';
import { UpdateSurveyDto } from './dto/update.survey.dto';
import { GetCurrentUser } from 'src/auth/common/decorators';

@Controller('surveys')
export class SurveysController {
  constructor(private surveysService: SurveysService) {}

  @Get()
  findAll(@GetCurrentUser('sub') userId: number) {
    return this.surveysService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUser('sub') userId: number, @Param('id') id: string) {
    return this.surveysService.findOne(userId, +id);
  }

  @Post()
  create(@GetCurrentUser('sub') userId: number, @Body() dto: CreateSurveyDto) {
    return this.surveysService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @GetCurrentUser('sub') userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateSurveyDto,
  ) {
    return this.surveysService.update(userId, +id, dto);
  }

  @Delete(':id')
  remove(@GetCurrentUser('sub') userId: number, @Param('id') id: string) {
    return this.surveysService.remove(userId, +id);
  }
}
